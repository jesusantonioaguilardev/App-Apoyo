import { describe, expect, it } from "vitest";
import { buildSystemPrompt, getAvatar } from "./avatars";

const base = { avatar: "gato", displayName: "Ana", humor: 0, formality: 4 };

describe("prompt del avatar", () => {
  it("usa la personalidad del avatar elegido", () => {
    expect(buildSystemPrompt(base)).toContain("Eres Michi");
    expect(getAvatar("desconocido").name).toBe("Sofía");
  });

  it("aplica humor, formalidad y nombre", () => {
    const p = buildSystemPrompt(base);
    expect(p).toContain("No uses humor.");
    expect(p).toContain("Habla de usted");
    expect(p).toContain("se llama Ana");
  });

  it("acota niveles fuera de rango", () => {
    expect(buildSystemPrompt({ ...base, humor: 99, formality: -3 })).toContain("Habla de tú, de forma muy coloquial");
  });

  it("siempre incluye el protocolo de crisis", () => {
    expect(buildSystemPrompt(base)).toContain("800 911 2000");
  });

  it("incluye memorias solo si existen", () => {
    expect(buildSystemPrompt(base)).not.toContain("eligió que recuerdes");
    expect(buildSystemPrompt(base, ["Tiene un perro llamado Max"])).toContain("- Tiene un perro llamado Max");
  });
});
