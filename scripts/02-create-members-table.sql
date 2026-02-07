-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  membership_type VARCHAR(50) NOT NULL, -- 'premium', 'standard', 'basic'
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'suspended', 'inactive'
  join_date DATE NOT NULL,
  expiry_date DATE,
  qr_code VARCHAR(255) UNIQUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_qr_code ON members(qr_code);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);

-- Create check-ins table for tracking member access
CREATE TABLE IF NOT EXISTS check_ins (
  id SERIAL PRIMARY KEY,
  member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  check_out_time TIMESTAMP,
  duration_minutes INTEGER,
  notes VARCHAR(255)
);

-- Create index on member_id and check_in_time
CREATE INDEX IF NOT EXISTS idx_checkins_member_id ON check_ins(member_id);
CREATE INDEX IF NOT EXISTS idx_checkins_time ON check_ins(check_in_time);
