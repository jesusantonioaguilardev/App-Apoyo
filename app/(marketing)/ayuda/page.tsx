import type { Metadata } from "next";
import { HELP_LINES_MX } from "@/lib/safety/crisis";

export const metadata: Metadata = { title: "Ayuda inmediata" };

export default function AyudaPage() {
  return (
    <section className="mx-auto max-w-2xl py-12">
      <h1 className="text-3xl font-extrabold">Si estás en peligro, busca ayuda ahora</h1>
      <p className="mt-3 text-muted">
        AppApoyo no es un servicio de emergencias. Si piensas hacerte daño o tu vida corre peligro, comunícate de
        inmediato:
      </p>
      <ul className="mt-6 space-y-4">
        {HELP_LINES_MX.map((line) => (
          <li key={line.phone} className="rounded-2xl border border-border bg-surface p-5">
            <p className="font-bold">{line.name}</p>
            <a href={`tel:${line.phone.replace(/\s/g, "")}`} className="text-2xl font-extrabold text-alert">
              {line.phone}
            </a>
            <p className="mt-1 text-sm text-muted">{line.description}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted">
        También puedes acudir al servicio de urgencias más cercano o pedir a alguien de confianza que te acompañe.
      </p>
    </section>
  );
}
