-- ══════════════════════════════════════════════════════════════════════════════
-- MindMoney — Supabase Schema
-- Execute no SQL Editor do Supabase Dashboard
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Extensions ────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Profiles ──────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id              uuid        references auth.users(id) on delete cascade primary key,
  full_name       text,
  avatar_url      text,
  monthly_budget  numeric(10,2) not null default 3000.00,
  streak_days     integer       not null default 0,
  streak_record   integer       not null default 0,
  last_entry_date date,
  created_at      timestamptz   not null default now(),
  updated_at      timestamptz   not null default now()
);

comment on table public.profiles is 'Perfil do usuário com preferências e estatísticas';

-- ── Transactions ──────────────────────────────────────────────────────────────
create table if not exists public.transactions (
  id          uuid        default gen_random_uuid() primary key,
  user_id     uuid        references public.profiles(id) on delete cascade not null,
  category    text        not null,
  amount      numeric(10,2) not null check (amount > 0),
  description text        not null,
  date        date        not null default current_date,
  futile      boolean     not null default false,
  created_at  timestamptz not null default now()
);

comment on table public.transactions is 'Registros de gastos do usuário';

-- ── User Badges ───────────────────────────────────────────────────────────────
create table if not exists public.user_badges (
  id          uuid        default gen_random_uuid() primary key,
  user_id     uuid        references public.profiles(id) on delete cascade not null,
  badge_id    text        not null,
  unlocked_at timestamptz not null default now(),
  constraint  uq_user_badge unique (user_id, badge_id)
);

comment on table public.user_badges is 'Badges/conquistas desbloqueadas pelo usuário';

-- ── Monthly Summaries (view) ───────────────────────────────────────────────────
create or replace view public.monthly_summaries as
select
  user_id,
  date_trunc('month', date)::date                        as month,
  sum(amount)                                            as total_spent,
  sum(case when futile then amount else 0 end)           as futile_spent,
  sum(case when not futile then amount else 0 end)       as essential_spent,
  count(*)                                               as transaction_count
from public.transactions
group by user_id, date_trunc('month', date)::date;

-- ══════════════════════════════════════════════════════════════════════════════
-- Row Level Security
-- ══════════════════════════════════════════════════════════════════════════════

alter table public.profiles    enable row level security;
alter table public.transactions enable row level security;
alter table public.user_badges  enable row level security;

-- Profiles
create policy "Usuário vê próprio perfil"
  on public.profiles for select using (auth.uid() = id);

create policy "Usuário atualiza próprio perfil"
  on public.profiles for update using (auth.uid() = id);

-- Transactions
create policy "Usuário vê próprias transações"
  on public.transactions for select using (auth.uid() = user_id);

create policy "Usuário insere próprias transações"
  on public.transactions for insert with check (auth.uid() = user_id);

create policy "Usuário deleta próprias transações"
  on public.transactions for delete using (auth.uid() = user_id);

-- Badges
create policy "Usuário vê próprios badges"
  on public.user_badges for select using (auth.uid() = user_id);

create policy "Usuário insere próprios badges"
  on public.user_badges for insert with check (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════════════════════════════
-- Functions & Triggers
-- ══════════════════════════════════════════════════════════════════════════════

-- Cria perfil automaticamente ao cadastrar usuário via Google OAuth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Atualiza updated_at automaticamente
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Atualiza streak quando nova transação é inserida
create or replace function public.update_streak_on_transaction()
returns trigger
language plpgsql
security definer
as $$
declare
  v_last_date date;
  v_today     date := current_date;
begin
  select last_entry_date into v_last_date
  from public.profiles
  where id = new.user_id;

  if v_last_date = v_today then
    -- Já registrou hoje, nada muda
    return new;
  elsif v_last_date = v_today - 1 then
    -- Dia consecutivo → incrementa streak
    update public.profiles
    set
      streak_days     = streak_days + 1,
      streak_record   = greatest(streak_record, streak_days + 1),
      last_entry_date = v_today
    where id = new.user_id;
  else
    -- Quebrou a sequência → reinicia
    update public.profiles
    set
      streak_days     = 1,
      last_entry_date = v_today
    where id = new.user_id;
  end if;

  return new;
end;
$$;

create trigger on_transaction_inserted
  after insert on public.transactions
  for each row execute procedure public.update_streak_on_transaction();

-- ══════════════════════════════════════════════════════════════════════════════
-- Índices para performance
-- ══════════════════════════════════════════════════════════════════════════════

create index if not exists idx_transactions_user_date
  on public.transactions(user_id, date desc);

create index if not exists idx_transactions_user_month
  on public.transactions(user_id, date_trunc('month', date));

create index if not exists idx_user_badges_user
  on public.user_badges(user_id);
