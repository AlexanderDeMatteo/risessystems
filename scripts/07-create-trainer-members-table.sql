-- Assignment of members to trainers (e.g. personal training)
CREATE TABLE IF NOT EXISTS trainer_members (
  id SERIAL PRIMARY KEY,
  trainer_id INTEGER NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  UNIQUE(trainer_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_trainer_members_trainer_id ON trainer_members(trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_members_member_id ON trainer_members(member_id);
