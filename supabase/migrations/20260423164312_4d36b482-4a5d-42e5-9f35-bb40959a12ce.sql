
-- =========================================================
-- Phase 1: Foundation — profiles, roles, town data, projects
-- =========================================================

-- App role enum
create type public.app_role as enum ('admin', 'contractor', 'user');

-- User type enum
create type public.user_type as enum ('homeowner', 'contractor');

-- =========================================================
-- profiles
-- =========================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  user_type public.user_type not null default 'homeowner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- =========================================================
-- user_roles (separate table — RLS-safe)
-- =========================================================
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- SECURITY DEFINER role check (prevents recursive RLS)
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "Admins can view all roles"
  on public.user_roles for select
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage roles"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- Auto-create profile + default 'user' role on signup
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, user_type)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce((new.raw_user_meta_data->>'user_type')::public.user_type, 'homeowner')
  );

  insert into public.user_roles (user_id, role)
  values (new.id, 'user');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- updated_at helper
-- =========================================================
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.tg_set_updated_at();

-- =========================================================
-- towns (public read; admin write)
-- =========================================================
create table public.towns (
  slug text primary key,
  name text not null,
  full_name text not null,
  county text not null,
  character text,
  source text,
  population text,
  median_home text,
  total_area text,
  num_zones int,
  last_verified timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.towns enable row level security;

create policy "Towns are publicly readable"
  on public.towns for select using (true);

create policy "Admins can manage towns"
  on public.towns for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger towns_set_updated_at
  before update on public.towns
  for each row execute function public.tg_set_updated_at();

-- =========================================================
-- zones, permits, ordinances, contacts (public read; admin write)
-- =========================================================
create table public.zones (
  id uuid primary key default gen_random_uuid(),
  town_slug text not null references public.towns(slug) on delete cascade,
  code text not null,
  name text not null,
  description text,
  min_lot text,
  setback_front text,
  setback_side text,
  setback_rear text,
  max_height text,
  max_coverage text,
  far text,
  permitted text[],
  conditional text[],
  prohibited text[],
  created_at timestamptz not null default now()
);
alter table public.zones enable row level security;
create policy "Zones publicly readable" on public.zones for select using (true);
create policy "Admins manage zones" on public.zones for all
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

create table public.permits (
  id uuid primary key default gen_random_uuid(),
  town_slug text not null references public.towns(slug) on delete cascade,
  name text not null,
  description text,
  requirements text[],
  timeline text,
  fee text,
  fee_note text,
  created_at timestamptz not null default now()
);
alter table public.permits enable row level security;
create policy "Permits publicly readable" on public.permits for select using (true);
create policy "Admins manage permits" on public.permits for all
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

create table public.ordinances (
  id uuid primary key default gen_random_uuid(),
  town_slug text not null references public.towns(slug) on delete cascade,
  category text not null,
  code text,
  title text not null,
  summary text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.ordinances enable row level security;
create policy "Ordinances publicly readable" on public.ordinances for select using (true);
create policy "Admins manage ordinances" on public.ordinances for all
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  town_slug text not null references public.towns(slug) on delete cascade,
  dept text not null,
  description text,
  phone text,
  email text,
  hours text,
  address text,
  website text,
  meetings text,
  created_at timestamptz not null default now()
);
alter table public.contacts enable row level security;
create policy "Contacts publicly readable" on public.contacts for select using (true);
create policy "Admins manage contacts" on public.contacts for all
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- =========================================================
-- saved_towns (per-user)
-- =========================================================
create table public.saved_towns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  town_slug text not null references public.towns(slug) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, town_slug)
);
alter table public.saved_towns enable row level security;
create policy "Users view own saved towns" on public.saved_towns for select
  using (auth.uid() = user_id);
create policy "Users manage own saved towns" on public.saved_towns for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================
-- projects (per-user)
-- =========================================================
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  town_slug text references public.towns(slug) on delete set null,
  address text not null,
  project_type text not null,
  zone text,
  status text not null default 'researching',
  checklist jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create policy "Users view own projects" on public.projects for select
  using (auth.uid() = user_id);
create policy "Users manage own projects" on public.projects for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.tg_set_updated_at();
