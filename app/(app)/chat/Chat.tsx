"use client";

import { useEffect, useRef, useState } from "react";
import { CrisisCard } from "@/components/CrisisCard";
import type { RiskLevel } from "@/lib/safety/crisis";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Props {
  avatarName: string;
  avatarEmoji: string;
  initialConversationId: string | null;
  initialMessages: ChatMessage[];
}

const MAX_CHARS = 2000;

export function Chat({ avatarName, avatarEmoji, initialConversationId, initialMessages }: Props) {
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [risk, setRisk] = useState<RiskLevel>("ninguno");
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    setError(null);
    setStreaming(true);
    const assistantId = crypto.randomUUID();
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), role: "user", content: text },
      { id: assistantId, role: "assistant", content: "" },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversationId }),
      });
      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "No se pudo enviar el mensaje");
      }
      setConversationId(res.headers.get("X-Conversation-Id"));
      const level = res.headers.get("X-Risk-Level") as RiskLevel | null;
      // El riesgo alto se mantiene visible durante la sesión.
      if (level && level !== "ninguno") setRisk((prev) => (prev === "alto" ? prev : level));

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((m) => m.map((msg) => (msg.id === assistantId ? { ...msg, content: msg.content + chunk } : msg)));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ocurrió un error");
      setMessages((m) => m.filter((msg) => msg.id !== assistantId || msg.content));
      setInput(text);
    } finally {
      setStreaming(false);
    }
  }

  function newConversation() {
    setConversationId(null);
    setMessages([]);
    setError(null);
  }

  return (
    <div className="flex h-[calc(100dvh-57px)] flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-3xl" aria-hidden>
            {avatarEmoji}
          </span>
          <span className="font-bold">{avatarName}</span>
        </div>
        <button
          type="button"
          onClick={newConversation}
          disabled={streaming}
          className="rounded-full border border-border px-3 py-1 text-sm"
        >
          Nueva conversación
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
        {messages.length === 0 && (
          <p className="mx-auto mt-10 max-w-sm text-center text-muted">
            Hola, soy {avatarName}. Cuéntame cómo te sientes hoy o lo que tengas en mente.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <p
              className={`max-w-[85%] rounded-2xl px-4 py-2 whitespace-pre-wrap ${
                m.role === "user" ? "bg-primary text-primary-foreground" : "border border-border bg-surface"
              }`}
            >
              {m.content || <span className="text-muted">{avatarName} está escribiendo…</span>}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="space-y-2 border-t border-border px-4 pt-3 pb-20">
        {risk !== "ninguno" && <CrisisCard level={risk} onClose={() => setRisk("ninguno")} />}
        {error && (
          <p className="text-sm text-alert" role="alert">
            {error}
          </p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-end gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            placeholder="Escribe aquí…"
            aria-label="Mensaje"
            className="flex-1 resize-none rounded-2xl border border-border bg-background px-4 py-2"
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            className="rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-50"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
