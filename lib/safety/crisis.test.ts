import { describe, expect, it } from "vitest";
import { detectRisk } from "./crisis";

describe("detección de riesgo", () => {
  it.each([
    "A veces pienso en el suicidio",
    "Ya no quiero vivir",
    "Me quiero morir",
    "quiero hacerme daño",
  ])("marca riesgo alto: %s", (t) => expect(detectRisk(t)).toBe("alto"));

  it.each(["Siento que nada vale la pena, no vale la pena", "quisiera desaparecer"])(
    "marca riesgo posible: %s",
    (t) => expect(detectRisk(t)).toBe("posible"),
  );

  it.each(["Hoy tuve un buen día", "Me siento cansado del trabajo"])(
    "no marca riesgo: %s",
    (t) => expect(detectRisk(t)).toBe("ninguno"),
  );
});
