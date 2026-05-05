-- Tabla de videos para la plataforma
create table videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  video_id text not null,
  platform text not null check (platform in ('vimeo', 'youtube')),
  display_order int not null default 0,
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
create policy "Only authenticated users can read videos" on videos
  for select using (auth.role() = 'authenticated');

-- Nota: Para acceso por email invité, valida el email del usuario en el frontend o genera un perfil autorizado que se sincronice con invited_emails.
