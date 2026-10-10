import type { Metadata } from "next";
import { getAvatar } from "@/lib/ai/avatars";
import { requireOnboardedUser } from "@/lib/supabase/session";
import { Chat, type ChatMessage } from "./Chat";

export const metadata: Metadata = { title: "Conversar" };

export default async function ChatPage() {
  const { supabase, profile } = await requireOnboardedUser();
  const avatar = getAvatar(profile.avatar);

  // Retoma la conversación escrita más reciente.
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("channel", "texto")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let messages: ChatMessage[] = [];
  if (conversation) {
    const { data } = await supabase
      .from("messages")
      .select("id, role, content")
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: false })
      .limit(50);
    messages = (data ?? []).reverse() as ChatMessage[];
  }

  return (
    <Chat
      avatarName={avatar.name}
      avatarEmoji={avatar.emoji}
      initialConversationId={conversation?.id ?? null}
      initialMessages={messages}
    />
  );
}
