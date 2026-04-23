
-- Lock down profiles: authenticated users only
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

-- Explicitly block self-writes to user_roles for non-admins
create policy "Block non-admin role inserts"
  on public.user_roles as restrictive
  for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Block non-admin role updates"
  on public.user_roles as restrictive
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Block non-admin role deletes"
  on public.user_roles as restrictive
  for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));
