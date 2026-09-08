-- PASTE KE: https://supabase.com/dashboard/project/zxgegwtyqahidhhcsprw/sql/new
-- Pastikan header project = zxgegwtyqahidhhcsprw
create extension if not exists "pgcrypto";

-- bersihkan trigger auth dulu (public table belum tentu ada, jadi jangan DROP TRIGGER public.* di sini)
drop trigger if exists trg_handle_new_user on auth.users;
drop function if exists public.handle_new_user_profile() cascade;
drop function if exists public.refresh_streak() cascade;
drop function if exists public.refresh_daily_summary() cascade;
drop function if exists public.handle_updated_at() cascade;

-- drop table cascade otomatis hapus trigger public.* jadi tidak perlu DROP TRIGGER per-table
drop table if exists public.daily_summary cascade;
drop table if exists public.kalori_intake cascade;
drop table if exists public.profiles cascade;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nama varchar(100) not null,
  usia int not null check (usia >= 13),
  gender varchar(10) not null check (gender in ('pria','wanita')),
  bb numeric(5,2) not null,
  tb int not null,
  target_bb numeric(5,2),
  tujuan varchar(20) not null check (tujuan in ('naikkan','stabilkan','turunkan')),
  bmi numeric(5,2), status_bmi varchar(20), bmr int, tdee int, target_kalori int,
  current_streak int default 0, longest_streak int default 0,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table public.kalori_intake (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tanggal date not null, waktu time, nama_makanan varchar(255) not null,
  kalori int not null check (kalori > 0),
  sumber varchar(20) not null check (sumber in ('ai','manual')),
  foto_url text, created_at timestamptz default now(), updated_at timestamptz default now()
);
create table public.daily_summary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tanggal date not null, total_kalori int default 0, hari_aktif boolean default true, memenuhi boolean default false,
  created_at timestamptz default now(), updated_at timestamptz default now(),
  unique(user_id, tanggal)
);
create index idx_kalori_user_tanggal on public.kalori_intake(user_id, tanggal);
create index idx_daily_user_tanggal on public.daily_summary(user_id, tanggal);

grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;

alter table public.profiles enable row level security;
alter table public.kalori_intake enable row level security;
alter table public.daily_summary enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "profiles_upsert_own" on public.profiles for all to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "kalori_select_own" on public.kalori_intake for select to authenticated using ((select auth.uid()) = user_id);
create policy "kalori_insert_own" on public.kalori_intake for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "kalori_update_own" on public.kalori_intake for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "kalori_delete_own" on public.kalori_intake for delete to authenticated using ((select auth.uid()) = user_id);
create policy "daily_select_own" on public.daily_summary for select to authenticated using ((select auth.uid()) = user_id);
create policy "daily_insert_own" on public.daily_summary for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "daily_update_own" on public.daily_summary for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "daily_delete_own" on public.daily_summary for delete to authenticated using ((select auth.uid()) = user_id);

create or replace function public.handle_updated_at() returns trigger language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;
create trigger trg_profiles_updated before update on public.profiles for each row execute function public.handle_updated_at();
create trigger trg_kalori_updated before update on public.kalori_intake for each row execute function public.handle_updated_at();
create trigger trg_daily_updated before update on public.daily_summary for each row execute function public.handle_updated_at();

create or replace function public.refresh_daily_summary() returns trigger language plpgsql security definer set search_path = public as $$
declare _total int; _target int; _tujuan varchar(20); _memenuhi boolean;
begin
  if tg_op = 'DELETE' then
    select coalesce(sum(kalori),0) into _total from public.kalori_intake where user_id = old.user_id and tanggal = old.tanggal;
    select target_kalori, tujuan into _target, _tujuan from public.profiles where id = old.user_id;
    _memenuhi := case when _tujuan='turunkan' then _total >= _target*0.85 and _total <= _target*1.05 when _tujuan='naikkan' then _total >= _target*0.95 else _total >= _target*0.9 and _total <= _target*1.1 end;
    insert into public.daily_summary(user_id,tanggal,total_kalori,memenuhi) values(old.user_id,old.tanggal,_total,coalesce(_memenuhi,false)) on conflict(user_id,tanggal) do update set total_kalori=excluded.total_kalori, memenuhi=excluded.memenuhi; return old;
  else
    select coalesce(sum(kalori),0) into _total from public.kalori_intake where user_id = new.user_id and tanggal = new.tanggal;
    select target_kalori, tujuan into _target, _tujuan from public.profiles where id = new.user_id;
    _memenuhi := case when _tujuan='turunkan' then _total >= _target*0.85 and _total <= _target*1.05 when _tujuan='naikkan' then _total >= _target*0.95 else _total >= _target*0.9 and _total <= _target*1.1 end;
    insert into public.daily_summary(user_id,tanggal,total_kalori,memenuhi) values(new.user_id,new.tanggal,_total,coalesce(_memenuhi,false)) on conflict(user_id,tanggal) do update set total_kalori=excluded.total_kalori, memenuhi=excluded.memenuhi; return new;
  end if;
end; $$;
create trigger trg_refresh_daily after insert or update or delete on public.kalori_intake for each row execute function public.refresh_daily_summary();

create or replace function public.refresh_streak() returns trigger language plpgsql security definer set search_path = public as $$
declare cur_streak int:=0; max_streak int:=0; run int:=0; r record;
begin
  for r in select tanggal, memenuhi from public.daily_summary where user_id = coalesce(new.user_id, old.user_id) order by tanggal asc loop if r.memenuhi then run:=run+1; max_streak:=greatest(max_streak, run); else run:=0; end if; end loop;
  cur_streak:=0; for r in select tanggal, memenuhi from public.daily_summary where user_id = coalesce(new.user_id, old.user_id) order by tanggal desc loop if r.tanggal = current_date - cur_streak and r.memenuhi then cur_streak:=cur_streak+1; else exit; end if; end loop;
  update public.profiles set current_streak=cur_streak, longest_streak=greatest(longest_streak, max_streak) where id=coalesce(new.user_id, old.user_id); return coalesce(new, old);
end; $$;
create trigger trg_refresh_streak after insert or update or delete on public.daily_summary for each row execute function public.refresh_streak();

create or replace function public.handle_new_user_profile() returns trigger language plpgsql security definer set search_path = public as $$
declare _meta jsonb; _nama text;
begin _meta := coalesce(new.raw_user_meta_data, '{}'::jsonb); _nama := coalesce(_meta->>'nama', split_part(new.email, '@', 1));
  insert into public.profiles (id, nama, usia, gender, bb, tb, tujuan, bmi, status_bmi, bmr, tdee, target_kalori) values (new.id, _nama, coalesce((_meta->>'usia')::int, 25), coalesce(_meta->>'gender','pria'), coalesce((_meta->>'bb')::numeric,60), coalesce((_meta->>'tb')::int,165), coalesce(_meta->>'tujuan','stabilkan'), 22, 'normal', 1500, 2325, 2325) on conflict (id) do nothing; return new;
end; $$;
create trigger trg_handle_new_user after insert on auth.users for each row execute function public.handle_new_user_profile();

revoke execute on function public.handle_new_user_profile() from anon, authenticated;
revoke execute on function public.refresh_daily_summary() from anon, authenticated;
revoke execute on function public.refresh_streak() from anon, authenticated;

insert into storage.buckets (id, name, public) values ('food-photos','food-photos', true) on conflict (id) do update set public=true;
drop policy if exists "food_photos_public_select" on storage.objects; create policy "food_photos_public_select" on storage.objects for select using (bucket_id='food-photos');
drop policy if exists "food_photos_auth_insert" on storage.objects; create policy "food_photos_auth_insert" on storage.objects for insert to authenticated with check (bucket_id='food-photos');
drop policy if exists "food_photos_auth_update" on storage.objects; create policy "food_photos_auth_update" on storage.objects for update to authenticated using (bucket_id='food-photos');
drop policy if exists "food_photos_auth_delete" on storage.objects; create policy "food_photos_auth_delete" on storage.objects for delete to authenticated using (bucket_id='food-photos');

NOTIFY pgrst, 'reload schema';
-- VERIFIKASI: SELECT * FROM public.profiles LIMIT 1; -- harus sukses tanpa PGRST205
