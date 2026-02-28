-- Trainers per gym owner, optionally assigned to a branch
CREATE TABLE IF NOT EXISTS trainers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  specialties TEXT,
  status VARCHAR(50) DEFAULT 'active',
  is_primary BOOLEAN DEFAULT false,
  hire_date DATE,
  avatar_url TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trainers_user_id ON trainers(user_id);
CREATE INDEX IF NOT EXISTS idx_trainers_branch_id ON trainers(branch_id);
CREATE INDEX IF NOT EXISTS idx_trainers_status ON trainers(status);
