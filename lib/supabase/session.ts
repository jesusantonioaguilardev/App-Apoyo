import "server-only";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "./env";
import { createClient } from "./server";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar: "hombre" | "mujer" | "gato" | null;
  humor: number;
  formality: number;
  memory_enabled: boolean;
  onboarded_at: string | null;
}

/** Usuario autenticado y su perfil; redirige a /login si no hay sesión. */
export async function requireUser() {
  if (!isSupabaseConfigured) redirect("/login");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar, humor, formality, memory_enabled, onboarded_at")
    .eq("id", user.id)
    .single<Profile>();
  if (error || !profile) throw new Error("No se encontró el perfil del usuario");

  return { supabase, user, profile };
}

/** Igual que requireUser, pero además exige haber completado el onboarding. */
export async function requireOnboardedUser() {
  const session = await requireUser();
  if (!session.profile.onboarded_at) redirect("/onboarding");
  return session;
}
