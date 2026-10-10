import type { Metadata } from "next";
import Link from "next/link";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Entrar" };

async function isGoogleEnabled(): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: { apikey: supabaseAnonKey },
      next: { revalidate: 60 },
    });
    const settings = await res.json();
    return Boolean(settings?.external?.google);
  } catch {
    return false;
  }
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/inicio";

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-12">
      <Link href="/" className="mb-6 text-center text-2xl font-extrabold text-primary">
        AppApoyo
      </Link>
      <div className="rounded-2xl border border-border bg-surface p-6">
        {error && <p className="mb-4 text-sm text-alert">No pudimos iniciar tu sesión. Inténtalo de nuevo.</p>}
        <LoginForm next={safeNext} configured={isSupabaseConfigured} googleEnabled={await isGoogleEnabled()} />
      </div>
      <p className="mt-4 text-center text-xs text-muted">
        Al continuar aceptas los <Link href="/terminos" className="underline">términos</Link> y el{" "}
        <Link href="/privacidad" className="underline">aviso de privacidad</Link>.
      </p>
    </main>
  );
}
