-- Optional: link member to a branch and to Supabase Auth (for future app/mobile login)
ALTER TABLE members ADD COLUMN IF NOT EXISTS branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL;
ALTER TABLE members ADD COLUMN IF NOT EXISTS auth_user_id UUID;

CREATE INDEX IF NOT EXISTS idx_members_branch_id ON members(branch_id);
CREATE INDEX IF NOT EXISTS idx_members_auth_user_id ON members(auth_user_id);
