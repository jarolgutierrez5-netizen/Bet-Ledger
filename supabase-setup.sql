create table if not exists public.betledger_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  bets jsonb not null default '[]'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.betledger_state enable row level security;

drop policy if exists "Users can read their own ledger" on public.betledger_state;
create policy "Users can read their own ledger"
on public.betledger_state for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own ledger" on public.betledger_state;
create policy "Users can insert their own ledger"
on public.betledger_state for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own ledger" on public.betledger_state;
create policy "Users can update their own ledger"
on public.betledger_state for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

grant select, insert, update on table public.betledger_state to authenticated;
