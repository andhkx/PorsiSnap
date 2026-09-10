-- PASTE KE: https://supabase.com/dashboard/project/zxgegwtyqahidhhcsprw/sql/new
-- 1 foto = 1 menu (rincian JSONB) — copy-paste lalu RUN, lalu NOTIFY reload
alter table public.kalori_intake add column if not exists rincian jsonb default '[]'::jsonb;
comment on column public.kalori_intake.rincian is '1 foto = 1 row: [{name,calories,portion}] grouping sub-makanan';
create index if not exists idx_kalori_user_foto on public.kalori_intake(user_id, foto_url);
NOTIFY pgrst, 'reload schema';
-- VERIFIKASI: select id,nama_makanan,kalori,rincian,foto_url from public.kalori_intake limit 1;
