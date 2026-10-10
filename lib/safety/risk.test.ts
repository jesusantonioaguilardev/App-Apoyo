import { describe, expect, it } from "vitest";
import { maxRisk, riskFromModeration } from "./risk";

describe("riesgo combinado", () => {
  it("toma el nivel más alto", () => {
    expect(maxRisk("ninguno", "posible")).toBe("posible");
    expect(maxRisk("alto", "posible")).toBe("alto");
    expect(maxRisk()).toBe("ninguno");
  });

  it("interpreta la moderación de OpenAI", () => {
    expect(riskFromModeration({ "self-harm/intent": true }, {})).toBe("alto");
    expect(riskFromModeration({ "self-harm/instructions": true }, {})).toBe("alto");
    expect(riskFromModeration({ "self-harm": true }, {})).toBe("posible");
    expect(riskFromModeration({}, { "self-harm": 0.5 })).toBe("posible");
    expect(riskFromModeration({}, { "self-harm": 0.05 })).toBe("ninguno");
  });
});
