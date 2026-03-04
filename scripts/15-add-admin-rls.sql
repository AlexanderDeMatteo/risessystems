-- Admin RLS: allow users with role = 'admin' to SELECT across all gym owners' data.
-- Run after 12-enable-rls.sql. Ensures admins can read users (clients), members, payments, etc.

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM users WHERE auth_user_id = auth.uid() AND role = 'admin');
$$;

-- users: admins can SELECT all (for clients list)
DROP POLICY IF EXISTS "users_select_own" ON users;
CREATE POLICY "users_select_own" ON users FOR SELECT
  USING (auth_user_id = auth.uid() OR is_admin());

-- members: admins can SELECT all (for aggregates / client stats)
CREATE POLICY "members_select_admin" ON members FOR SELECT
  USING (is_admin());

-- payments: admins can SELECT all (for revenue aggregates)
CREATE POLICY "payments_select_admin" ON payments FOR SELECT
  USING (is_admin());

-- branches: admins can SELECT all
CREATE POLICY "branches_select_admin" ON branches FOR SELECT
  USING (is_admin());

-- trainers: admins can SELECT all
CREATE POLICY "trainers_select_admin" ON trainers FOR SELECT
  USING (is_admin());
