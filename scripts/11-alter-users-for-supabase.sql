-- Link app users to Supabase Auth (required for RLS and Fase 3 login)
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;

CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
