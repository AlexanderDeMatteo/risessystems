-- Platform plans (SaaS tiers). Only admins can manage. Run after 15-add-admin-rls.sql.

CREATE TABLE IF NOT EXISTS platform_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  min_active_users INTEGER NOT NULL DEFAULT 0,
  max_active_users INTEGER,
  price_monthly DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  overage_threshold INTEGER,
  overage_price_per_user DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_platform_plans_sort ON platform_plans(sort_order);

ALTER TABLE platform_plans ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can read (for dashboard subscription display)
CREATE POLICY "platform_plans_select" ON platform_plans FOR SELECT
  TO authenticated USING (true);

-- Only admins can modify
CREATE POLICY "platform_plans_insert_admin" ON platform_plans FOR INSERT
  WITH CHECK (is_admin());
CREATE POLICY "platform_plans_update_admin" ON platform_plans FOR UPDATE
  USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "platform_plans_delete_admin" ON platform_plans FOR DELETE
  USING (is_admin());
