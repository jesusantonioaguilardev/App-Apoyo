import type { Metadata } from "next";

export const metadata: Metadata = { title: "Aviso de privacidad" };

// BORRADOR: debe revisarlo un abogado antes del lanzamiento.
export default function PrivacidadPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-4 py-12 leading-relaxed">
      <h1 className="text-3xl font-extrabold">Aviso de privacidad</h1>
      <p className="rounded-lg bg-surface p-3 text-sm text-alert">Borrador pendiente de revisión legal.</p>
      <h2 className="text-xl font-bold">Datos que tratamos</h2>
      <p>
        Datos de identificación y contacto (correo electrónico), preferencias de la app y el contenido que compartes en tus
        conversaciones, registros emocionales y memoria. Parte de esta información puede considerarse{" "}
        <strong>dato personal sensible</strong> por referirse a tu salud emocional, por lo que solo la tratamos con tu
        consentimiento expreso, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
      </p>
      <h2 className="text-xl font-bold">Para qué los usamos</h2>
      <p>
        Para prestarte el servicio de acompañamiento, recordar lo que elijas que recordemos, generar tus resúmenes de avance
        y cobrar tu suscripción.
      </p>
      <h2 className="text-xl font-bold">Voz</h2>
      <p>El audio de las sesiones de voz se procesa para generar la respuesta y no se conserva por defecto.</p>
      <h2 className="text-xl font-bold">Proveedores</h2>
      <p>Usamos proveedores de infraestructura, inteligencia artificial y pagos que procesan datos por nuestra cuenta.</p>
      <h2 className="text-xl font-bold">Tus derechos (ARCO)</h2>
      <p>
        Puedes acceder, rectificar, cancelar u oponerte al tratamiento de tus datos, así como revocar tu consentimiento,
        exportar o borrar tu información desde tu cuenta.
      </p>
    </article>
  );
}
