// Recursos de ayuda y detección básica de riesgo.
// La detección por palabras es solo una primera red; en la Fase 1 se complementa con un
// clasificador de IA y los protocolos deben ser revisados por el psicólogo del proyecto.

export interface HelpLine {
  name: string;
  phone: string;
  description: string;
}

export const HELP_LINES_MX: readonly HelpLine[] = [
  { name: "Emergencias", phone: "911", description: "Si tu vida o la de alguien más está en peligro inmediato." },
  {
    name: "Línea de la Vida",
    phone: "800 911 2000",
    description: "Atención en salud mental y adicciones, gratuita, 24 horas.",
  },
];

export type RiskLevel = "ninguno" | "posible" | "alto";

const HIGH_RISK = [
  /\bsuicid/i,
  /\bmatarme\b/i,
  /\bquitarme la vida\b/i,
  /\bno quiero (seguir )?vivir\b/i,
  /\bacabar con (mi vida|todo)\b/i,
  /\bhacerme daño\b/i,
  /\bme quiero morir\b/i,
];

const POSSIBLE_RISK = [
  /\bno vale la pena\b/i,
  /\bsin salida\b/i,
  /\bdesaparecer\b/i,
  /\bnadie me (quiere|extrañaría)\b/i,
  /\bme corto\b/i,
  /\bme lastim/i,
];

export function detectRisk(text: string): RiskLevel {
  if (HIGH_RISK.some((r) => r.test(text))) return "alto";
  if (POSSIBLE_RISK.some((r) => r.test(text))) return "posible";
  return "ninguno";
}
