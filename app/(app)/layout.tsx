import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-border bg-surface">
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 text-sm">
          <Link href="/inicio" className="text-lg font-bold text-primary">
            AppApoyo
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/chat" className="hover:text-primary">
              Conversar
            </Link>
            <Link href="/onboarding" className="hover:text-primary">
              Preferencias
            </Link>
            <form action="/auth/salir" method="post">
              <button type="submit" className="text-muted hover:text-primary">
                Salir
              </button>
            </form>
          </div>
        </nav>
      </header>
      {children}
    </>
  );
}
