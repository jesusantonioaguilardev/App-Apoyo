"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AVATARS, FORMALITY_LABELS, HUMOR_LABELS } from "@/lib/ai/avatars";
import { saveOnboarding, type OnboardingState } from "./actions";

export interface OnboardingDefaults {
  displayName: string;
  avatar: string | null;
  humor: number;
  formality: number;
  memoryEnabled: boolean;
}

export function OnboardingForm({ defaults }: { defaults: OnboardingDefaults }) {
  const [state, formAction, pending] = useActionState<OnboardingState, FormData>(saveOnboarding, {});
  const [humor, setHumor] = useState(defaults.humor);
  const [formality, setFormality] = useState(defaults.formality);

  return (
    <form action={formAction} className="space-y-8">
      <fieldset>
        <legend className="text-lg font-bold">1. Elige a tu acompañante</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {AVATARS.map((a) => (
            <label
              key={a.id}
              className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-border bg-surface p-4 text-center has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/30"
            >
              <input
                type="radio"
                name="avatar"
                value={a.id}
                defaultChecked={defaults.avatar === a.id}
                required
                className="sr-only"
              />
              <span className="text-5xl" aria-hidden>
                {a.emoji}
              </span>
              <span className="font-bold">{a.name}</span>
              <span className="text-sm text-muted">{a.description}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-bold">2. ¿Cómo prefieres que te hable?</legend>
        <label className="block text-sm">
          ¿Cómo quieres que te llame? (opcional)
          <input
            name="displayName"
            maxLength={40}
            defaultValue={defaults.displayName}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Humor: <strong>{HUMOR_LABELS[humor]}</strong>
          <input
            type="range"
            name="humor"
            min={0}
            max={4}
            value={humor}
            onChange={(e) => setHumor(Number(e.target.value))}
            className="mt-2 w-full accent-primary"
          />
        </label>
        <label className="block text-sm">
          Formalidad: <strong>{FORMALITY_LABELS[formality]}</strong>
          <input
            type="range"
            name="formality"
            min={0}
            max={4}
            value={formality}
            onChange={(e) => setFormality(Number(e.target.value))}
            className="mt-2 w-full accent-primary"
          />
        </label>
      </fieldset>

      <fieldset className="space-y-3 text-sm">
        <legend className="text-lg font-bold">3. Privacidad</legend>
        <label className="flex gap-3 rounded-xl border border-border bg-surface p-4">
          <input type="checkbox" name="memoryEnabled" defaultChecked={defaults.memoryEnabled} className="mt-1 accent-primary" />
          <span>
            <strong>Recordar lo que te importa (opcional).</strong> Tu acompañante guardará datos clave de tus conversaciones
            para darles continuidad. Podrás verlos, editarlos o borrarlos cuando quieras.
          </span>
        </label>
        <label className="flex gap-3 rounded-xl border border-border bg-surface p-4">
          <input type="checkbox" name="consentSensitive" required className="mt-1 accent-primary" />
          <span>
            Doy mi consentimiento expreso para que AppApoyo trate la información sobre mi estado emocional que comparta,
            según el <Link href="/privacidad" className="underline" target="_blank">aviso de privacidad</Link>.
          </span>
        </label>
        <label className="flex gap-3 rounded-xl border border-border bg-surface p-4">
          <input type="checkbox" name="consentTerms" required className="mt-1 accent-primary" />
          <span>
            Entiendo que AppApoyo es acompañamiento con IA y no sustituye la atención de un profesional ni los servicios de
            emergencia. Acepto los <Link href="/terminos" className="underline" target="_blank">términos</Link>.
          </span>
        </label>
      </fieldset>

      {state.error && (
        <p className="text-sm text-alert" role="alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-primary py-3 text-lg font-bold text-primary-foreground disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Empezar a conversar"}
      </button>
    </form>
  );
}
