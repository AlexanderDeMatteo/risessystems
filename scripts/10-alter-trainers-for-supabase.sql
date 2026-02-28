-- Optional: link trainer to Supabase Auth (for future app/mobile)
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS auth_user_id UUID;

CREATE INDEX IF NOT EXISTS idx_trainers_auth_user_id ON trainers(auth_user_id);
