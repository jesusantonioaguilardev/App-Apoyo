-- AppApoyo: esquema inicial con Row Level Security.
-- Regla general: cada usuario solo lee/escribe sus propias filas. Las tablas de cobro,
-- cuotas, costos y riesgo solo se escriben desde el servidor (service role), que omite RLS.

create extension if not exists vector;

-- Planes -------------------------------------------------------------------
create table public.plans (
  code text primary key check (code in ('esencial', 'conecta', 'cerca', 'integral')),
  name text not null,
  price_mxn numeric(10, 2) not null,
  voice_minutes integer not null default 0,
  summary_frequency text not null check (summary_frequency in ('mensual', 'quincenal', 'semanal')),
  voice_settings boolean not null default false,
  weekly_plan boolean not null default false,
  stripe_price_id text
);

insert into public.plans (code, name, price_mxn, voice_minutes, summary_frequency, voice_settings, weekly_plan) values
  ('esencial', 'Esencial', 299, 0, 'mensual', false, false),
  ('conecta', 'Conecta', 599, 300, 'mensual', true, true),
  ('cerca', 'Cerca', 999, 900, 'quincenal', true, true),
  ('integral', 'Integral', 2000, 2700, 'semanal', true, true);

-- Perfiles -----------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar text check (avatar in ('hombre', 'mujer', 'gato')),
  humor smallint not null default 2 check (humor between 0 and 4),
  formality smallint not null default 2 check (formality between 0 and 4),
  voice text,
  memory_enabled boolean not null default false,
  consent_sensitive_data_at timestamptz, -- consentimiento expreso (LFPDPPP, datos de salud)
  consent_terms_at timestamptz,
  onboarded_at timestamptz,
  created_at timestamptz not null default now()
);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Suscripciones y cuotas ---------------------------------------------------
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_code text not null references public.plans (code),
  status text not null check (status in ('trialing', 'active', 'past_due', 'canceled', 'incomplete')),
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  created_at timestamptz not null default now()
);
create index on public.subscriptions (user_id);

create table public.voice_quota (
  user_id uuid not null references auth.users (id) on delete cascade,
  period_start timestamptz not null,
  period_end timestamptz not null,
  included_seconds integer not null,
  used_seconds integer not null default 0 check (used_seconds >= 0 and used_seconds <= included_seconds),
  primary key (user_id, period_start)
);

create table public.voice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  provider text not null,
  started_at timestamptz not null default now(),
  last_heartbeat_at timestamptz,
  ended_at timestamptz,
  billable_seconds integer not null default 0,
  estimated_cost_mxn numeric(10, 4) not null default 0,
  end_reason text check (end_reason in ('usuario', 'cuota_agotada', 'desconexion', 'error', 'inactividad'))
);
create index on public.voice_sessions (user_id, started_at desc);

-- Conversaciones y memoria --------------------------------------------------
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  channel text not null default 'texto' check (channel in ('texto', 'voz')),
  summary text,
  created_at timestamptz not null default now()
);
create index on public.conversations (user_id, created_at desc);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
create index on public.messages (conversation_id, created_at);

create table public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  embedding vector(1536),
  source_conversation_id uuid references public.conversations (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.memories (user_id);

-- Bienestar y progreso ------------------------------------------------------
create table public.mood_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  mood smallint not null check (mood between 1 and 5),
  emotions text[] not null default '{}',
  note text,
  created_at timestamptz not null default now()
);
create index on public.mood_entries (user_id, created_at desc);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('ejercicio', 'juego', 'audio')),
  content_slug text not null,
  completed_at timestamptz not null default now()
);

create table public.weekly_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  week_start date not null,
  items jsonb not null default '[]',
  unique (user_id, week_start)
);

create table public.progress_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  period_start date not null,
  period_end date not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- Riesgo y costos (solo servidor/admin) ------------------------------------
create table public.risk_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  level text not null check (level in ('posible', 'alto')),
  channel text not null check (channel in ('texto', 'voz')),
  resources_shown boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.usage_costs (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  text_tokens_in bigint not null default 0,
  text_tokens_out bigint not null default 0,
  voice_seconds integer not null default 0,
  cost_mxn numeric(12, 4) not null default 0,
  primary key (user_id, day)
);

-- RLS -----------------------------------------------------------------------
alter table public.plans enable row level security;
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.voice_quota enable row level security;
alter table public.voice_sessions enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.memories enable row level security;
alter table public.mood_entries enable row level security;
alter table public.activities enable row level security;
alter table public.weekly_plans enable row level security;
alter table public.progress_summaries enable row level security;
alter table public.risk_events enable row level security;
alter table public.usage_costs enable row level security;

-- Planes: lectura pública (página de precios).
create policy "planes visibles" on public.plans for select using (true);

-- Perfil: el usuario lee y edita el suyo.
create policy "perfil propio: leer" on public.profiles for select using ((select auth.uid()) = id);
create policy "perfil propio: editar" on public.profiles for update
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Solo lectura para el usuario (las escribe el servidor).
create policy "suscripcion propia" on public.subscriptions for select using ((select auth.uid()) = user_id);
create policy "cuota propia" on public.voice_quota for select using ((select auth.uid()) = user_id);
create policy "sesiones de voz propias" on public.voice_sessions for select using ((select auth.uid()) = user_id);
create policy "resumenes propios" on public.progress_summaries for select using ((select auth.uid()) = user_id);

-- Control total del usuario sobre su contenido.
create policy "conversaciones propias" on public.conversations for all
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "mensajes propios" on public.messages for all
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "memorias propias" on public.memories for all
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "registro emocional propio" on public.mood_entries for all
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "actividades propias" on public.activities for all
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "plan semanal propio" on public.weekly_plans for all
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- risk_events y usage_costs: sin políticas → solo service role (panel admin).

-- Uso y costos: suma atómica por usuario y día. Solo la llama el servidor (service role).
create function public.add_usage(
  p_user_id uuid,
  p_tokens_in bigint default 0,
  p_tokens_out bigint default 0,
  p_voice_seconds integer default 0,
  p_cost_mxn numeric default 0
) returns void
language sql security definer set search_path = '' as $$
  insert into public.usage_costs as u (user_id, day, text_tokens_in, text_tokens_out, voice_seconds, cost_mxn)
  values (p_user_id, (now() at time zone 'America/Mexico_City')::date, p_tokens_in, p_tokens_out, p_voice_seconds, p_cost_mxn)
  on conflict (user_id, day) do update set
    text_tokens_in = u.text_tokens_in + excluded.text_tokens_in,
    text_tokens_out = u.text_tokens_out + excluded.text_tokens_out,
    voice_seconds = u.voice_seconds + excluded.voice_seconds,
    cost_mxn = u.cost_mxn + excluded.cost_mxn;
$$;

revoke execute on function public.add_usage from public, anon, authenticated;
grant execute on function public.add_usage to service_role;
