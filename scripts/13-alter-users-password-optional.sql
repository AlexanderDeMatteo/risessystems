-- Allow Supabase Auth users: no password stored in public.users
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
