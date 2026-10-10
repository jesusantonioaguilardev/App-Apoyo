import type { Metadata } from "next";

export const metadata: Metadata = { title: "Términos y condiciones" };

// BORRADOR: debe revisarlo un abogado antes del lanzamiento.
export default function TerminosPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-4 py-12 leading-relaxed">
      <h1 className="text-3xl font-extrabold">Términos y condiciones</h1>
      <p className="rounded-lg bg-surface p-3 text-sm text-alert">Borrador pendiente de revisión legal.</p>
      <h2 className="text-xl font-bold">Naturaleza del servicio</h2>
      <p>
        AppApoyo ofrece acompañamiento emocional mediante inteligencia artificial. No es atención psicológica, diagnóstico
        ni tratamiento, y no sustituye a un profesional de la salud mental ni a los servicios de emergencia.
      </p>
      <h2 className="text-xl font-bold">Suscripciones y minutos de voz</h2>
      <p>
        Los minutos de voz incluidos en cada plan se renuevan al inicio de cada periodo mensual y no se acumulan. Se cuenta
        el tiempo de la sesión de voz conectada. Al agotarse, puedes continuar por texto hasta el siguiente periodo.
      </p>
      <h2 className="text-xl font-bold">Cancelación</h2>
      <p>Puedes cancelar en cualquier momento; el plan sigue activo hasta el final del periodo pagado.</p>
    </article>
  );
}
