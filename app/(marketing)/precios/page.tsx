import type { Metadata } from "next";
import { PlanCards } from "@/components/PlanCards";

export const metadata: Metadata = { title: "Planes" };

export default function PreciosPage() {
  return (
    <section className="py-12">
      <h1 className="text-3xl font-extrabold">Planes</h1>
      <p className="mt-2 text-muted">
        Las llamadas son conversaciones con IA. La atención de un psicólogo se contrata por separado.
      </p>
      <div className="mt-8">
        <PlanCards />
      </div>
      <div className="mt-8 rounded-2xl border border-border bg-surface p-5 text-sm">
        <h2 className="font-bold">Cómo funcionan los minutos de voz</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Se renuevan cada mes y no se acumulan.</li>
          <li>Se cuenta el tiempo de la sesión de voz conectada; puedes pausarla y consultar tu saldo.</li>
          <li>Te avisamos antes de agotarlos y puedes seguir conversando por texto.</li>
          <li>Recordar información es opcional en todos los planes.</li>
        </ul>
      </div>
    </section>
  );
}
