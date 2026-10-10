import { detectRisk, type RiskLevel } from "./crisis";

export { detectRisk, type RiskLevel };

const ORDER: Record<RiskLevel, number> = { ninguno: 0, posible: 1, alto: 2 };

export function maxRisk(...levels: RiskLevel[]): RiskLevel {
  return levels.reduce((a, b) => (ORDER[b] > ORDER[a] ? b : a), "ninguno");
}

// Subconjunto de la respuesta de Moderación que nos interesa.
type Flags = Partial<Record<"self-harm" | "self-harm/intent" | "self-harm/instructions", boolean>>;
type Scores = Partial<Record<"self-harm" | "self-harm/intent" | "self-harm/instructions", number>>;

export const POSSIBLE_SCORE = 0.3;

export function riskFromModeration(categories: Flags, scores: Scores): RiskLevel {
  if (categories["self-harm/intent"] || categories["self-harm/instructions"]) return "alto";
  if (categories["self-harm"] || (scores["self-harm"] ?? 0) >= POSSIBLE_SCORE) return "posible";
  return "ninguno";
}
