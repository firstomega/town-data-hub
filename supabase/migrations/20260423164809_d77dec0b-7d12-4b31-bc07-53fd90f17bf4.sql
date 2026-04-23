
drop policy if exists "Block non-admin role inserts" on public.user_roles;
drop policy if exists "Block non-admin role updates" on public.user_roles;
drop policy if exists "Block non-admin role deletes" on public.user_roles;

create policy "Block non-admin role inserts"
  on public.user_roles as restrictive
  for insert
  to public
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Block non-admin role updates"
  on public.user_roles as restrictive
  for update
  to public
  using (public.has_role(auth.uid(), 'admin'));

create policy "Block non-admin role deletes"
  on public.user_roles as restrictive
  for delete
  to public
  using (public.has_role(auth.uid(), 'admin'));
