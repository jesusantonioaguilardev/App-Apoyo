import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 pb-24 text-sm text-muted sm:flex-row sm:justify-between">
        <p>AppApoyo es acompañamiento con IA y no sustituye la atención de un profesional de la salud mental.</p>
        <div className="flex gap-4">
          <Link href="/privacidad">Privacidad</Link>
          <Link href="/terminos">Términos</Link>
          <Link href="/ayuda">Ayuda</Link>
        </div>
      </div>
    </footer>
  );
}
