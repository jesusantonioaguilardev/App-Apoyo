import type { Metadata } from "next";
import Link from "next/link";
import { getAvatar } from "@/lib/ai/avatars";
import { requireOnboardedUser } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Inicio" };
export const dynamic = "force-dynamic";

export default async function InicioPage() {
  const { profile } = await requireOnboardedUser();
  const avatar = getAvatar(profile.avatar);

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 text-center">
      <span className="text-7xl" aria-hidden>
        {avatar.emoji}
      </span>
      <h1 className="mt-4 text-3xl font-extrabold">Hola{profile.display_name ? `, ${profile.display_name}` : ""}</h1>
      <p className="mt-2 text-muted">{avatar.name} está aquí para escucharte.</p>
      <Link
        href="/chat"
        className="mt-8 inline-block rounded-full bg-primary px-8 py-3 text-lg font-bold text-primary-foreground"
      >
        Conversar con {avatar.name}
      </Link>
      <p className="mt-10 text-sm text-muted">Próximamente: voz, registro emocional, ejercicios y memoria.</p>
    </main>
  );
}
