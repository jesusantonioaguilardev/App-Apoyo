"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Mode = "entrar" | "registro";

export function LoginForm({
  next,
  configured,
  googleEnabled,
}: {
  next: string;
  configured: boolean;
  googleEnabled: boolean;
}) {
  const [mode, setMode] = useState<Mode>("entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ kind: "error" | "info"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const callbackUrl = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const supabase = createClient();
    const { error } =
      mode === "entrar"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: callbackUrl() } });
    setLoading(false);
    if (error) return setStatus({ kind: "error", text: error.message });
    if (mode === "registro") return setStatus({ kind: "info", text: "Revisa tu correo para confirmar tu cuenta." });
    window.location.assign(next);
  }

  async function onGoogle() {
    if (!googleEnabled) {
      return setStatus({ kind: "error", text: "El inicio de sesión con Google aún no está activado." });
    }
    setStatus(null);
    setLoading(true);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl(), queryParams: { prompt: "select_account" } },
    });
    // Si no hay error, el navegador ya se está redirigiendo a Google.
    if (error) {
      setLoading(false);
      setStatus({ kind: "error", text: "No pudimos conectar con Google. Inténtalo de nuevo." });
    }
  }

  if (!configured) {
    return (
      <p className="rounded-lg bg-surface p-4 text-sm text-alert">
        Falta configurar Supabase: copia <code>.env.example</code> a <code>.env.local</code> y completa las llaves.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex rounded-full border border-border p-1 text-sm">
        {(["entrar", "registro"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 rounded-full py-2 font-semibold ${mode === m ? "bg-primary text-primary-foreground" : ""}`}
          >
            {m === "entrar" ? "Entrar" : "Crear cuenta"}
          </button>
        ))}
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm">
          Correo
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
            autoComplete="email"
          />
        </label>
        <label className="block text-sm">
          Contraseña
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
            autoComplete={mode === "entrar" ? "current-password" : "new-password"}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary py-2 font-semibold text-primary-foreground disabled:opacity-60"
        >
          {loading ? "Un momento…" : mode === "entrar" ? "Entrar" : "Crear cuenta"}
        </button>
      </form>
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />o<span className="h-px flex-1 bg-border" />
      </div>
      <button
        type="button"
        onClick={onGoogle}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-white py-2 font-semibold text-[#1f1f1f] disabled:opacity-60"
      >
        <svg viewBox="0 0 48 48" className="size-5" aria-hidden>
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
          <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
        Continuar con Google
      </button>
      {status && (
        <p className={`text-sm ${status.kind === "error" ? "text-alert" : "text-primary"}`} role="status">
          {status.text}
        </p>
      )}
    </div>
  );
}
