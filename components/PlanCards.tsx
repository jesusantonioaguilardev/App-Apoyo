import Link from "next/link";
import { COMMON_FEATURES, PLANS, dailyVoiceMinutes } from "@/lib/billing/plans";

const formatMxn = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);

export function PlanCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {PLANS.map((plan) => (
        <article
          key={plan.code}
          className={`flex flex-col rounded-2xl border bg-surface p-5 ${
            plan.code === "cerca" ? "border-primary ring-2 ring-primary/30" : "border-border"
          }`}
        >
          <h3 className="text-xl font-bold">{plan.name}</h3>
          <p className="mt-1 text-3xl font-extrabold">
            {formatMxn(plan.priceMxn)}
            <span className="text-base font-normal text-muted"> /mes</span>
          </p>
          <p className="mt-2 min-h-12 text-sm text-muted">{plan.tagline}</p>
          <ul className="mt-4 flex-1 space-y-2 text-sm">
            <li className="font-semibold">
              {plan.voiceMinutes === 0
                ? "Sin llamadas de voz"
                : `${plan.voiceMinutes.toLocaleString("es-MX")} min de voz al mes (~${dailyVoiceMinutes(plan)} min/día)`}
            </li>
            <li>Resumen de avances {plan.summaryFrequency}</li>
            <li>{plan.voiceSettings ? "Ajustes de voz, humor y formalidad" : "Ajustes de humor y formalidad"}</li>
            {plan.weeklyPlan && <li>Plan semanal de actividades personalizado</li>}
          </ul>
          <Link
            href={`/login?plan=${plan.code}`}
            className="mt-5 rounded-full bg-primary px-4 py-2 text-center font-semibold text-primary-foreground"
          >
            Elegir {plan.name}
          </Link>
        </article>
      ))}
      <div className="rounded-2xl border border-border bg-surface p-5 sm:col-span-2 lg:col-span-4">
        <h3 className="font-bold">Incluido en todos los planes</h3>
        <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
          {COMMON_FEATURES.map((f) => (
            <li key={f}>✓ {f}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
