
-- profiles
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = user_id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = user_id);

create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at_column();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- natal_charts
create table public.natal_charts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  birth_date date not null,
  birth_time time not null,
  birth_place text not null,
  chart_data jsonb,
  description text,
  created_at timestamptz not null default now()
);
create index natal_charts_user_idx on public.natal_charts(user_id);
alter table public.natal_charts enable row level security;
create policy "natal_select_own" on public.natal_charts for select using (auth.uid() = user_id);
create policy "natal_insert_own" on public.natal_charts for insert with check (auth.uid() = user_id);
create policy "natal_update_own" on public.natal_charts for update using (auth.uid() = user_id);
create policy "natal_delete_own" on public.natal_charts for delete using (auth.uid() = user_id);

-- pyramid_choices
create table public.pyramid_choices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  themes text[] not null,
  chosen_at timestamptz not null default now()
);
create index pyramid_choices_user_idx on public.pyramid_choices(user_id, chosen_at desc);
alter table public.pyramid_choices enable row level security;
create policy "pc_select_own" on public.pyramid_choices for select using (auth.uid() = user_id);
create policy "pc_insert_own" on public.pyramid_choices for insert with check (auth.uid() = user_id);
create policy "pc_delete_own" on public.pyramid_choices for delete using (auth.uid() = user_id);

-- pyramid_progress
create table public.pyramid_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  theme text not null,
  value smallint not null,
  entry_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique(user_id, theme, entry_date)
);
create index pyramid_progress_user_idx on public.pyramid_progress(user_id, entry_date desc);
alter table public.pyramid_progress enable row level security;
create policy "pp_select_own" on public.pyramid_progress for select using (auth.uid() = user_id);
create policy "pp_insert_own" on public.pyramid_progress for insert with check (auth.uid() = user_id);
create policy "pp_update_own" on public.pyramid_progress for update using (auth.uid() = user_id);
