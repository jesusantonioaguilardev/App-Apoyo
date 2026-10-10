import "server-only";
import { openai } from "@/lib/ai/openai";
import { detectRisk, maxRisk, riskFromModeration, type RiskLevel } from "./risk";

/**
 * Combina la detección por palabras con la API de Moderación de OpenAI.
 * Si la moderación falla, se usa solo la detección local: la conversación no se bloquea.
 */
export async function assessRisk(text: string): Promise<RiskLevel> {
  const local = detectRisk(text);
  try {
    const res = await openai.moderations.create({ model: "omni-moderation-latest", input: text });
    const r = res.results[0];
    return maxRisk(local, riskFromModeration(r.categories, r.category_scores));
  } catch (err) {
    console.error("Moderación no disponible", err);
    return local;
  }
}
