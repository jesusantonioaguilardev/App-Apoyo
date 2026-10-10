# AppApoyo

Acompañamiento emocional con IA (texto y voz) con avatar hombre, mujer o gato. Web primero (Next.js + Supabase).

## Arranque local

1. `npm install`
2. Copia `.env.example` a `.env.local` y completa las llaves de Supabase.
3. En Supabase: SQL Editor → ejecuta `supabase/migrations/0001_esquema_inicial.sql`
   (o `supabase db push` con la CLI). Activa el proveedor Google en Authentication si se usará.
4. `npm run dev` → http://localhost:3000

## Scripts

- `npm run dev` / `npm run build` / `npm run lint`
- `npm test` — pruebas de planes, cuotas de voz y detección de riesgo

## Estructura

- `lib/billing/plans.ts` — fuente única de los 4 planes (Esencial, Conecta, Cerca, Integral)
- `lib/billing/quota.ts` — cuota de voz: avisos 80%/95%, sin acumulación entre periodos
- `lib/safety/crisis.ts` — líneas de ayuda en México y detección básica de riesgo
- `lib/supabase/` y `proxy.ts` — sesión y protección de rutas privadas
- `supabase/migrations/` — esquema con Row Level Security

## Estado

Fase 0 (base) lista. Siguiente: Fase 1 — onboarding, chat con IA, memoria y bienestar.
Las páginas de privacidad y términos son borradores pendientes de revisión legal.
