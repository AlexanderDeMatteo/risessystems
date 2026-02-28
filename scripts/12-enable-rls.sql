-- Row Level Security: each gym owner sees only their data.
-- Run after 01-11. Requires users.auth_user_id to be set (Fase 3 Auth).
-- Helper: current app user id from Supabase Auth
CREATE OR REPLACE FUNCTION get_my_user_id()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM users WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;

-- users: own row only (insert allowed so signup can create profile with auth_user_id = auth.uid())
CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth_user_id = auth.uid());
CREATE POLICY "users_insert_own" ON users FOR INSERT WITH CHECK (auth_user_id = auth.uid());
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth_user_id = auth.uid());

-- sessions: own sessions only
CREATE POLICY "sessions_all_own" ON sessions FOR ALL USING (user_id = get_my_user_id());

-- members: own gym members only
CREATE POLICY "members_all_own" ON members FOR ALL USING (user_id = get_my_user_id());

-- check_ins: via member ownership
CREATE POLICY "check_ins_select_own" ON check_ins FOR SELECT
  USING (member_id IN (SELECT id FROM members WHERE user_id = get_my_user_id()));
CREATE POLICY "check_ins_insert_own" ON check_ins FOR INSERT
  WITH CHECK (member_id IN (SELECT id FROM members WHERE user_id = get_my_user_id()));
CREATE POLICY "check_ins_update_own" ON check_ins FOR UPDATE
  USING (member_id IN (SELECT id FROM members WHERE user_id = get_my_user_id()));
CREATE POLICY "check_ins_delete_own" ON check_ins FOR DELETE
  USING (member_id IN (SELECT id FROM members WHERE user_id = get_my_user_id()));

-- payments, revenue_summary, branches, trainers, membership_plans: by user_id
CREATE POLICY "payments_all_own" ON payments FOR ALL USING (user_id = get_my_user_id());
CREATE POLICY "revenue_summary_all_own" ON revenue_summary FOR ALL USING (user_id = get_my_user_id());
CREATE POLICY "branches_all_own" ON branches FOR ALL USING (user_id = get_my_user_id());
CREATE POLICY "trainers_all_own" ON trainers FOR ALL USING (user_id = get_my_user_id());
CREATE POLICY "membership_plans_all_own" ON membership_plans FOR ALL USING (user_id = get_my_user_id());

-- trainer_members: via trainer ownership
CREATE POLICY "trainer_members_select_own" ON trainer_members FOR SELECT
  USING (trainer_id IN (SELECT id FROM trainers WHERE user_id = get_my_user_id()));
CREATE POLICY "trainer_members_insert_own" ON trainer_members FOR INSERT
  WITH CHECK (trainer_id IN (SELECT id FROM trainers WHERE user_id = get_my_user_id()));
CREATE POLICY "trainer_members_update_own" ON trainer_members FOR UPDATE
  USING (trainer_id IN (SELECT id FROM trainers WHERE user_id = get_my_user_id()));
CREATE POLICY "trainer_members_delete_own" ON trainer_members FOR DELETE
  USING (trainer_id IN (SELECT id FROM trainers WHERE user_id = get_my_user_id()));
