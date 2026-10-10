// Fuente única de los planes. La tabla `plans` de Supabase se siembra con estos mismos valores.

export type PlanCode = "esencial" | "conecta" | "cerca" | "integral";
export type SummaryFrequency = "mensual" | "quincenal" | "semanal";

export interface Plan {
  code: PlanCode;
  name: string;
  priceMxn: number;
  voiceMinutes: number;
  tagline: string;
  summaryFrequency: SummaryFrequency;
  voiceSettings: boolean; // ajustes de voz (humor y formalidad están en todos)
  weeklyPlan: boolean;
}

export const PLANS: readonly Plan[] = [
  {
    code: "esencial",
    name: "Esencial",
    priceMxn: 299,
    voiceMinutes: 0,
    tagline: "Un espacio para expresarte, comprender tus emociones y encontrar actividades para tu día.",
    summaryFrequency: "mensual",
    voiceSettings: false,
    weeklyPlan: false,
  },
  {
    code: "conecta",
    name: "Conecta",
    priceMxn: 599,
    voiceMinutes: 300,
    tagline: "Añade la cercanía de la voz a tu acompañamiento.",
    summaryFrequency: "mensual",
    voiceSettings: true,
    weeklyPlan: true,
  },
  {
    code: "cerca",
    name: "Cerca",
    priceMxn: 999,
    voiceMinutes: 900,
    tagline: "Más tiempo para conversar y dar continuidad a tus objetivos.",
    summaryFrequency: "quincenal",
    voiceSettings: true,
    weeklyPlan: true,
  },
  {
    code: "integral",
    name: "Integral",
    priceMxn: 2000,
    voiceMinutes: 2700,
    tagline: "Acompañamiento por voz amplio, a tu ritmo.",
    summaryFrequency: "semanal",
    voiceSettings: true,
    weeklyPlan: true,
  },
];

// Incluido en todos los planes.
export const COMMON_FEATURES = [
  "Conversación escrita con IA",
  "Elección de avatar: hombre, mujer o gato",
  "Memoria personal editable (opcional)",
  "Registro emocional y ejercicios",
  "Juegos y actividades",
  "Audios previamente grabados",
  "Recursos de ayuda ante crisis",
] as const;

export const PAYMENT_FEE_RATE = 0.15; // comisión de cobro de referencia

export function getPlan(code: PlanCode): Plan {
  const plan = PLANS.find((p) => p.code === code);
  if (!plan) throw new Error(`Plan desconocido: ${code}`);
  return plan;
}

export function netRevenueMxn(plan: Plan, feeRate = PAYMENT_FEE_RATE): number {
  return Math.round(plan.priceMxn * (1 - feeRate) * 100) / 100;
}

export function dailyVoiceMinutes(plan: Plan, daysInMonth = 30): number {
  return plan.voiceMinutes / daysInMonth;
}
