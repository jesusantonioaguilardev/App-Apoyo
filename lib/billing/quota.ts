// Cuota de voz: los minutos se renuevan por periodo y no se acumulan.

export interface VoiceQuota {
  includedSeconds: number;
  usedSeconds: number;
}

export type QuotaLevel = "ok" | "aviso" | "critico" | "agotado" | "sin_voz";

export const WARNING_RATIO = 0.8;
export const CRITICAL_RATIO = 0.95;

export function remainingSeconds(q: VoiceQuota): number {
  return Math.max(0, q.includedSeconds - q.usedSeconds);
}

export function quotaLevel(q: VoiceQuota): QuotaLevel {
  if (q.includedSeconds <= 0) return "sin_voz";
  const ratio = q.usedSeconds / q.includedSeconds;
  if (ratio >= 1) return "agotado";
  if (ratio >= CRITICAL_RATIO) return "critico";
  if (ratio >= WARNING_RATIO) return "aviso";
  return "ok";
}

/** Descuenta un latido de la sesión; nunca supera lo incluido. */
export function consume(q: VoiceQuota, seconds: number): VoiceQuota {
  if (seconds < 0) throw new Error("Los segundos no pueden ser negativos");
  return { ...q, usedSeconds: Math.min(q.includedSeconds, q.usedSeconds + seconds) };
}

/** Nuevo periodo: se reinicia con los minutos del plan, sin arrastrar saldo previo. */
export function newPeriod(planMinutes: number): VoiceQuota {
  return { includedSeconds: planMinutes * 60, usedSeconds: 0 };
}

export function formatRemaining(q: VoiceQuota): string {
  const s = remainingSeconds(q);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h} h ${m} min` : `${m} min`;
}
