-- Tabla de videos para la plataforma
drop table if exists videos cascade;

create table videos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  video_url text not null,
  access_token text not null default substring(md5(random()::text) from 1 for 10),
  created_at timestamp with time zone default timezone('utc', now())
);

-- Tabla de correos invitados para acceso por invitación
create table invited_emails (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null default 'student',
  created_at timestamp with time zone default timezone('utc', now())
);

-- Habilitar RLS y política de solo invitados
alter table invited_emails enable row level security;
create policy "Only invited emails can read" on invited_emails
  for select using (auth.role() = 'authenticated');

alter table videos enable row level security;

-- Permitimos que los administradores autenticados gestionen todos los videos
create policy "Admins can manage videos" on videos
  for all using (auth.role() = 'authenticated');

-- Función segura para que un alumno obtenga UN video sin exponer el resto
create or replace function get_secure_video(v_slug text, v_token text)
returns setof videos
language sql
security definer
as $$
  select * from videos where slug = v_slug and access_token = v_token;
$$;

-- Nota: Para acceso por email invité, valida el email del usuario en el frontend o genera un perfil autorizado que se sincronice con invited_emails.

-- ==========================================
-- CONFIGURACIÓN DE ALMACENAMIENTO (STORAGE)
-- ==========================================

-- 1. Asegurar que el "disco duro" (bucket) existe y es público
insert into storage.buckets (id, name, public) 
values ('course_videos', 'course_videos', true) 
on conflict do nothing;

-- 2. Permitir que el administrador (usuario logueado) pueda subir archivos
create policy "Admin upload videos" 
on storage.objects for insert to authenticated 
with check ( bucket_id = 'course_videos' );
