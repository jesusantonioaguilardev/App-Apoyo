import type { Metadata } from "next";
import { requireUser } from "@/lib/supabase/session";
import { OnboardingForm } from "./OnboardingForm";

export const metadata: Metadata = { title: "Bienvenida" };

export default async function OnboardingPage() {
  const { profile } = await requireUser();

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">{profile.onboarded_at ? "Tus preferencias" : "Te damos la bienvenida"}</h1>
      <p className="mt-2 mb-8 text-muted">Personaliza tu acompañamiento. Puedes cambiar esto cuando quieras.</p>
      <OnboardingForm
        defaults={{
          displayName: profile.display_name ?? "",
          avatar: profile.avatar,
          humor: profile.humor,
          formality: profile.formality,
          memoryEnabled: profile.memory_enabled,
        }}
      />
    </main>
  );
}
