-- Mobile app RLS: members and trainers linked via auth_user_id can read (and members update self) their data.
-- Run after 21-create-competitions.sql (and 22 if applied). Safe to re-run (DROP POLICY IF EXISTS + CREATE).

-- -----------------------------------------------------------------------------
-- Helpers: resolve app member / trainer row from Supabase Auth
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_my_member_id()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM members WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION get_my_trainer_id()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM trainers WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION get_my_member_id() TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_trainer_id() TO authenticated;

-- -----------------------------------------------------------------------------
-- members: self read + trainer reads assigned members
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "members_select_self" ON members;
CREATE POLICY "members_select_self" ON members FOR SELECT
  USING (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "members_select_by_trainer" ON members;
CREATE POLICY "members_select_by_trainer" ON members FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM trainer_members tm
      INNER JOIN trainers t ON t.id = tm.trainer_id
      WHERE tm.member_id = members.id
        AND t.auth_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "members_update_self" ON members;
CREATE POLICY "members_update_self" ON members FOR UPDATE
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- check_ins: member sees own; trainer sees assigned members' check-ins
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "check_ins_select_self" ON check_ins;
CREATE POLICY "check_ins_select_self" ON check_ins FOR SELECT
  USING (member_id = get_my_member_id());

DROP POLICY IF EXISTS "check_ins_select_by_trainer" ON check_ins;
CREATE POLICY "check_ins_select_by_trainer" ON check_ins FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM trainer_members tm
      INNER JOIN trainers t ON t.id = tm.trainer_id
      WHERE tm.member_id = check_ins.member_id
        AND t.auth_user_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- membership_plans: member can read plans offered by their gym owner
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "membership_plans_select_member" ON membership_plans;
CREATE POLICY "membership_plans_select_member" ON membership_plans FOR SELECT
  USING (
    user_id IN (
      SELECT m.user_id FROM members m WHERE m.auth_user_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- trainers: trainer reads own row
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "trainers_select_self" ON trainers;
CREATE POLICY "trainers_select_self" ON trainers FOR SELECT
  USING (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "trainers_update_self" ON trainers;
CREATE POLICY "trainers_update_self" ON trainers FOR UPDATE
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- trainer_members: trainer sees own assignments
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "trainer_members_select_by_trainer_self" ON trainer_members;
CREATE POLICY "trainer_members_select_by_trainer_self" ON trainer_members FOR SELECT
  USING (trainer_id = get_my_trainer_id());

-- -----------------------------------------------------------------------------
-- branches: member sees branch they belong to
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "branches_select_member" ON branches;
CREATE POLICY "branches_select_member" ON branches FOR SELECT
  USING (
    id IN (
      SELECT m.branch_id FROM members m
      WHERE m.auth_user_id = auth.uid() AND m.branch_id IS NOT NULL
    )
  );

-- Trainer may need branch name for their profile (trainers.branch_id)
DROP POLICY IF EXISTS "branches_select_trainer" ON branches;
CREATE POLICY "branches_select_trainer" ON branches FOR SELECT
  USING (
    id IN (
      SELECT t.branch_id FROM trainers t
      WHERE t.auth_user_id = auth.uid() AND t.branch_id IS NOT NULL
    )
  );

-- -----------------------------------------------------------------------------
-- competitions: internal competitions visible to members of that gym (active/completed)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "competitions_select_member_internal" ON competitions;
CREATE POLICY "competitions_select_member_internal" ON competitions FOR SELECT
  USING (
    scope = 'internal'
    AND status IN ('active', 'completed')
    AND EXISTS (
      SELECT 1 FROM members m
      WHERE m.auth_user_id = auth.uid()
        AND m.user_id = competitions.created_by_user_id
    )
  );

-- -----------------------------------------------------------------------------
-- competition_gyms / challenges / scores for those internal competitions (member view)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "competition_gyms_select_member_internal" ON competition_gyms;
CREATE POLICY "competition_gyms_select_member_internal" ON competition_gyms FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM competitions c
      INNER JOIN members m ON m.user_id = c.created_by_user_id
      WHERE c.id = competition_gyms.competition_id
        AND c.scope = 'internal'
        AND c.status IN ('active', 'completed')
        AND m.auth_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "challenges_select_member_internal" ON challenges;
CREATE POLICY "challenges_select_member_internal" ON challenges FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM competitions c
      INNER JOIN members m ON m.user_id = c.created_by_user_id
      WHERE c.id = challenges.competition_id
        AND c.scope = 'internal'
        AND c.status IN ('active', 'completed')
        AND m.auth_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "challenge_gym_scores_select_member_internal" ON challenge_gym_scores;
CREATE POLICY "challenge_gym_scores_select_member_internal" ON challenge_gym_scores FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM challenges ch
      INNER JOIN competitions c ON c.id = ch.competition_id
      INNER JOIN members m ON m.user_id = c.created_by_user_id
      WHERE ch.id = challenge_gym_scores.challenge_id
        AND c.scope = 'internal'
        AND c.status IN ('active', 'completed')
        AND m.auth_user_id = auth.uid()
    )
  );
