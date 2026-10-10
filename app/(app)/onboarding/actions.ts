"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const OnboardingSchema = z.object({
  displayName: z.string().trim().max(40).optional(),
  avatar: z.enum(["hombre", "mujer", "gato"]),
  humor: z.coerce.number().int().min(0).max(4),
  formality: z.coerce.number().int().min(0).max(4),
  memoryEnabled: z.literal("on").optional(),
  consentSensitive: z.literal("on"),
  consentTerms: z.literal("on"),
});

export type OnboardingState = { error?: string };

export async function saveOnboarding(_prev: OnboardingState, formData: FormData): Promise<OnboardingState> {
  const parsed = OnboardingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Elige un avatar y acepta el consentimiento y los términos para continuar." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const d = parsed.data;
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: d.displayName || null,
      avatar: d.avatar,
      humor: d.humor,
      formality: d.formality,
      memory_enabled: d.memoryEnabled === "on",
      consent_sensitive_data_at: now,
      consent_terms_at: now,
      onboarded_at: now,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error al guardar onboarding", error);
    return { error: "No pudimos guardar tus preferencias. Inténtalo de nuevo." };
  }
  redirect("/chat");
}
