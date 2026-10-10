import { describe, expect, it } from "vitest";
import { PLANS, dailyVoiceMinutes, getPlan, netRevenueMxn } from "./plans";

describe("planes", () => {
  it("define los cuatro planes en orden de precio", () => {
    expect(PLANS.map((p) => p.priceMxn)).toEqual([299, 599, 999, 2000]);
  });

  it("calcula el ingreso después de la comisión del 15%", () => {
    expect(netRevenueMxn(getPlan("esencial"))).toBe(254.15);
    expect(netRevenueMxn(getPlan("integral"))).toBe(1700);
  });

  it("el plan Integral equivale a 90 minutos diarios", () => {
    expect(dailyVoiceMinutes(getPlan("integral"))).toBe(90);
    expect(getPlan("esencial").voiceMinutes).toBe(0);
  });
});
