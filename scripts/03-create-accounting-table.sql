-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_type VARCHAR(50) NOT NULL, -- 'membership', 'personal_training', 'other'
  description VARCHAR(255),
  payment_method VARCHAR(50) DEFAULT 'cash', -- 'cash', 'card', 'bank_transfer'
  status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'refunded'
  paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create revenue summary table
CREATE TABLE IF NOT EXISTS revenue_summary (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  summary_date DATE NOT NULL,
  daily_revenue DECIMAL(10, 2) DEFAULT 0,
  membership_fees DECIMAL(10, 2) DEFAULT 0,
  personal_training DECIMAL(10, 2) DEFAULT 0,
  other_revenue DECIMAL(10, 2) DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, summary_date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_member_id ON payments(member_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(paid_at);
CREATE INDEX IF NOT EXISTS idx_revenue_user_id ON revenue_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_revenue_date ON revenue_summary(summary_date);
