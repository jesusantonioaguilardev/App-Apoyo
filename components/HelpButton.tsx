import Link from "next/link";

// Siempre visible, en todos los planes y pantallas.
export function HelpButton() {
  return (
    <Link
      href="/ayuda"
      className="fixed right-4 bottom-4 z-50 rounded-full bg-alert px-4 py-3 text-sm font-bold text-white shadow-lg"
    >
      ¿Necesitas ayuda ahora?
    </Link>
  );
}
