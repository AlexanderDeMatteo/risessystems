-- Membership plans per gym owner (used by dashboard/plans)
CREATE TABLE IF NOT EXISTS membership_plans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration_days INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_membership_plans_user_id ON membership_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_membership_plans_is_active ON membership_plans(is_active);
