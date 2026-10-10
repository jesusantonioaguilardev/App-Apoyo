import { describe, expect, it } from "vitest";
import { consume, formatRemaining, newPeriod, quotaLevel, remainingSeconds } from "./quota";

describe("cuota de voz", () => {
  it("avisa al 80% y al 95%", () => {
    const q = newPeriod(300);
    expect(quotaLevel(q)).toBe("ok");
    expect(quotaLevel(consume(q, 240 * 60))).toBe("aviso");
    expect(quotaLevel(consume(q, 285 * 60))).toBe("critico");
    expect(quotaLevel(consume(q, 300 * 60))).toBe("agotado");
  });

  it("no consume más de lo incluido", () => {
    const q = consume(newPeriod(10), 99999);
    expect(remainingSeconds(q)).toBe(0);
    expect(q.usedSeconds).toBe(600);
  });

  it("el nuevo periodo no acumula saldo", () => {
    const fresh = newPeriod(300);
    expect(fresh).toEqual({ includedSeconds: 18000, usedSeconds: 0 });
  });

  it("el plan sin voz se marca como sin_voz", () => {
    expect(quotaLevel(newPeriod(0))).toBe("sin_voz");
  });

  it("rechaza segundos negativos", () => {
    expect(() => consume(newPeriod(10), -1)).toThrow();
  });

  it("formatea el saldo", () => {
    expect(formatRemaining(consume(newPeriod(300), 30 * 60))).toBe("4 h 30 min");
    expect(formatRemaining(newPeriod(45))).toBe("45 min");
  });
});
