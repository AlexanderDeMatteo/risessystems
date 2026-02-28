-- Branches (gym locations) per gym owner
CREATE TABLE IF NOT EXISTS branches (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_branches_user_id ON branches(user_id);
CREATE INDEX IF NOT EXISTS idx_branches_is_active ON branches(is_active);
