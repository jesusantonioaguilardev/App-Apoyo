import { z } from "zod";
import { buildSystemPrompt } from "@/lib/ai/avatars";
import {
  CHAT_MODEL,
  CHAT_REASONING_EFFORT,
  HISTORY_MESSAGES,
  MAX_OUTPUT_TOKENS,
  MAX_USER_MESSAGE_CHARS,
  openai,
} from "@/lib/ai/openai";
import { assessRisk } from "@/lib/safety/moderation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const BodySchema = z.object({
  message: z.string().trim().min(1).max(MAX_USER_MESSAGE_CHARS),
  conversationId: z.uuid().nullish(),
});

const FALLBACK_REPLY =
  "Perdona, tuve un problema para responderte en este momento. ¿Me lo puedes repetir en un ratito? Si necesitas ayuda inmediata, llama a la Línea de la Vida: 800 911 2000.";

export async function POST(request: Request) {
  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Mensaje inválido" }, { status: 400 });
  const { message } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "No autenticado" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar, humor, formality, memory_enabled, onboarded_at")
    .eq("id", user.id)
    .single();
  if (!profile?.onboarded_at) return Response.json({ error: "Completa tu bienvenida primero" }, { status: 403 });

  // Conversación: se valida por RLS que pertenezca al usuario.
  let conversationId = parsed.data.conversationId ?? null;
  if (conversationId) {
    const { data } = await supabase.from("conversations").select("id").eq("id", conversationId).maybeSingle();
    if (!data) conversationId = null;
  }
  if (!conversationId) {
    const { data, error } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, channel: "texto" })
      .select("id")
      .single();
    if (error || !data) return Response.json({ error: "No se pudo crear la conversación" }, { status: 500 });
    conversationId = data.id as string;
  }

  const [risk] = await Promise.all([
    assessRisk(message),
    supabase.from("messages").insert({ conversation_id: conversationId, user_id: user.id, role: "user", content: message }),
  ]);

  const admin = createAdminClient();
  if (risk !== "ninguno") {
    // Solo se registra el nivel, no el contenido.
    await admin.from("risk_events").insert({ user_id: user.id, level: risk, channel: "texto" });
  }

  const [{ data: history }, { data: memories }] = await Promise.all([
    supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(HISTORY_MESSAGES),
    profile.memory_enabled
      ? supabase.from("memories").select("content").order("updated_at", { ascending: false }).limit(20)
      : Promise.resolve({ data: [] as { content: string }[] }),
  ]);

  const instructions = buildSystemPrompt(
    { avatar: profile.avatar, displayName: profile.display_name, humor: profile.humor, formality: profile.formality },
    (memories ?? []).map((m) => m.content),
  );
  const input = (history ?? [])
    .reverse()
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content as string }));

  const encoder = new TextEncoder();
  const userId = user.id;
  const convId = conversationId;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let reply = "";
      let tokensIn = 0;
      let tokensOut = 0;
      try {
        const events = await openai.responses.create({
          model: CHAT_MODEL,
          instructions,
          input,
          reasoning: { effort: CHAT_REASONING_EFFORT },
          max_output_tokens: MAX_OUTPUT_TOKENS,
          store: false,
          stream: true,
        });
        for await (const event of events) {
          if (event.type === "response.output_text.delta") {
            reply += event.delta;
            controller.enqueue(encoder.encode(event.delta));
          } else if (event.type === "response.completed" && event.response.usage) {
            tokensIn = event.response.usage.input_tokens;
            tokensOut = event.response.usage.output_tokens;
          }
        }
      } catch (err) {
        console.error("Error del modelo de chat", err);
        if (!reply) {
          reply = FALLBACK_REPLY;
          controller.enqueue(encoder.encode(reply));
        }
      } finally {
        controller.close();
        if (reply) {
          await supabase
            .from("messages")
            .insert({ conversation_id: convId, user_id: userId, role: "assistant", content: reply });
        }
        if (tokensIn || tokensOut) {
          await admin.rpc("add_usage", { p_user_id: userId, p_tokens_in: tokensIn, p_tokens_out: tokensOut });
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Conversation-Id": convId,
      "X-Risk-Level": risk,
    },
  });
}
