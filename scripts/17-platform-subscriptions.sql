-- === 17-platform-subscriptions.sql ===
-- Platform subscriptions and payments: what gym owners pay to the platform.
-- Run after 16-create-platform-plans.sql and 15-add-admin-rls.sql.

-- Links gym owner to an active platform plan
CREATE TABLE IF NOT EXISTS platform_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform_plan_id INTEGER NOT NULL REFERENCES platform_plans(id) ON DELETE RESTRICT,
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'past_due'
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_platform_subscriptions_user_id ON platform_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_subscriptions_status ON platform_subscriptions(status);

-- Payments from gym owners to the platform (subscription fees)
CREATE TABLE IF NOT EXISTS platform_payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_platform_payments_user_id ON platform_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_payments_status ON platform_payments(status);
CREATE INDEX IF NOT EXISTS idx_platform_payments_paid_at ON platform_payments(paid_at);

ALTER TABLE platform_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_payments ENABLE ROW LEVEL SECURITY;

-- platform_subscriptions: owners see own row; admins full access
CREATE POLICY "platform_subscriptions_select_own" ON platform_subscriptions FOR SELECT
  USING (user_id = get_my_user_id() OR is_admin());
CREATE POLICY "platform_subscriptions_insert_admin" ON platform_subscriptions FOR INSERT
  WITH CHECK (is_admin());
CREATE POLICY "platform_subscriptions_update_admin" ON platform_subscriptions FOR UPDATE
  USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "platform_subscriptions_delete_admin" ON platform_subscriptions FOR DELETE
  USING (is_admin());

-- platform_payments: owners see own row; admins full access
CREATE POLICY "platform_payments_select_own" ON platform_payments FOR SELECT
  USING (user_id = get_my_user_id() OR is_admin());
CREATE POLICY "platform_payments_insert_admin" ON platform_payments FOR INSERT
  WITH CHECK (is_admin());
CREATE POLICY "platform_payments_update_admin" ON platform_payments FOR UPDATE
  USING (is_admin()) WITH CHECK (is_admin());
