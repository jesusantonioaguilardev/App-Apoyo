import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-bold text-primary">
          AppApoyo
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/precios" className="hover:text-primary">
            Planes
          </Link>
          <Link href="/login" className="rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground">
            Entrar
          </Link>
        </div>
      </nav>
    </header>
  );
}
