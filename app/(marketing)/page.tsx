import Link from "next/link";
import { PlanCards } from "@/components/PlanCards";

const AVATARS = [
  { emoji: "🧑", name: "Hombre" },
  { emoji: "👩", name: "Mujer" },
  { emoji: "🐱", name: "Gato" },
];

export default function Home() {
  return (
    <>
      <section className="py-16 text-center">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Alguien con quien hablar, a tu ritmo.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          Conversa por texto o por voz con tu avatar, registra cómo te sientes y encuentra ejercicios y actividades para tu
          día.
        </p>
        <div className="mt-8 flex justify-center gap-6">
          {AVATARS.map((a) => (
            <div key={a.name} className="flex flex-col items-center gap-2">
              <span className="flex size-20 items-center justify-center rounded-full bg-surface text-4xl shadow" aria-hidden>
                {a.emoji}
              </span>
              <span className="text-sm font-semibold">{a.name}</span>
            </div>
          ))}
        </div>
        <Link
          href="/login"
          className="mt-10 inline-block rounded-full bg-primary px-8 py-3 text-lg font-bold text-primary-foreground"
        >
          Comenzar
        </Link>
      </section>
      <section id="planes" className="py-8">
        <h2 className="mb-6 text-2xl font-bold">Planes</h2>
        <PlanCards />
      </section>
    </>
  );
}
