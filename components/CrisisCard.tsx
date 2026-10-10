import { HELP_LINES_MX, type RiskLevel } from "@/lib/safety/crisis";

export function CrisisCard({ level, onClose }: { level: Exclude<RiskLevel, "ninguno">; onClose?: () => void }) {
  return (
    <div role="alert" className="rounded-2xl border-2 border-alert bg-surface p-4 text-sm">
      <p className="font-bold">
        {level === "alto"
          ? "Lo que sientes importa y no tienes que pasarlo a solas. Habla ahora con alguien que puede ayudarte:"
          : "Si en algún momento sientes que no puedes más, hay personas listas para escucharte:"}
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {HELP_LINES_MX.map((l) => (
          <li key={l.phone}>
            <a
              href={`tel:${l.phone.replace(/\s/g, "")}`}
              className="inline-block rounded-full bg-alert px-4 py-2 font-bold text-white"
            >
              {l.name}: {l.phone}
            </a>
          </li>
        ))}
      </ul>
      {level === "posible" && onClose && (
        <button type="button" onClick={onClose} className="mt-2 text-xs text-muted underline">
          Ocultar
        </button>
      )}
    </div>
  );
}
