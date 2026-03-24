-- Fix: "infinite recursion detected in policy for relation competition_gyms"
-- Run in Supabase SQL editor if you already applied 21-create-competitions.sql
-- (policies that SELECT competition_gyms from within competition_gyms / competitions policies).
-- Safe to run multiple times (idempotent policies via DROP + CREATE).

CREATE OR REPLACE FUNCTION is_user_participant_in_competition(
  p_competition_id INTEGER,
  p_user_id INTEGER
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM competition_gyms cg
    WHERE cg.competition_id = p_competition_id
      AND cg.user_id = p_user_id
  );
$$;

GRANT EXECUTE ON FUNCTION is_user_participant_in_competition(INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION is_user_participant_in_competition(INTEGER, INTEGER) TO anon;

CREATE OR REPLACE FUNCTION refresh_competition_scores(p_competition_id INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_app_user INTEGER;
  ch RECORD;
  cg RECORD;
  v_raw NUMERIC(12, 2);
  v_norm NUMERIC(12, 4);
  v_weighted NUMERIC(12, 4);
  v_starts TIMESTAMP;
  v_ends TIMESTAMP;
BEGIN
  SELECT id INTO v_app_user FROM users WHERE auth_user_id = auth.uid() LIMIT 1;

  IF NOT (
    COALESCE(is_admin(), false)
    OR (
      v_app_user IS NOT NULL
      AND is_user_participant_in_competition(p_competition_id, v_app_user)
    )
  ) THEN
    RAISE EXCEPTION 'Not allowed to refresh competition scores';
  END IF;

  SELECT starts_at, ends_at INTO v_starts, v_ends
  FROM competitions WHERE id = p_competition_id;

  IF v_starts IS NULL THEN
    RAISE EXCEPTION 'Competition not found';
  END IF;

  FOR ch IN SELECT * FROM challenges WHERE competition_id = p_competition_id ORDER BY sort_order, id
  LOOP
    FOR cg IN SELECT * FROM competition_gyms WHERE competition_id = p_competition_id
    LOOP
      IF ch.metric_type = 'check_in_count' THEN
        SELECT COUNT(*)::NUMERIC(12, 2) INTO v_raw
        FROM check_ins ci
        INNER JOIN members m ON m.id = ci.member_id
        WHERE m.user_id = cg.user_id
          AND ci.check_in_time >= v_starts
          AND ci.check_in_time <= v_ends;
      ELSE
        v_raw := 0;
      END IF;

      IF ch.normalization = 'per_active_member' AND cg.active_members_snapshot > 0 THEN
        v_norm := v_raw / cg.active_members_snapshot::NUMERIC;
      ELSE
        v_norm := v_raw;
      END IF;

      v_weighted := v_norm * ch.points_weight;

      INSERT INTO challenge_gym_scores (challenge_id, user_id, raw_value, normalized_value, weighted_points, updated_at)
      VALUES (ch.id, cg.user_id, v_raw, v_norm, v_weighted, CURRENT_TIMESTAMP)
      ON CONFLICT (challenge_id, user_id) DO UPDATE SET
        raw_value = EXCLUDED.raw_value,
        normalized_value = EXCLUDED.normalized_value,
        weighted_points = EXCLUDED.weighted_points,
        updated_at = EXCLUDED.updated_at;
    END LOOP;
  END LOOP;
END;
$$;

DROP POLICY IF EXISTS "competitions_select" ON competitions;
CREATE POLICY "competitions_select" ON competitions FOR SELECT
  USING (
    is_admin()
    OR is_user_participant_in_competition(id, get_my_user_id())
    OR (
      is_public_leaderboard = true
      AND status IN ('active', 'completed')
      AND public_slug IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "competition_gyms_select" ON competition_gyms;
CREATE POLICY "competition_gyms_select" ON competition_gyms FOR SELECT
  USING (
    is_admin()
    OR user_id = get_my_user_id()
    OR is_user_participant_in_competition(competition_id, get_my_user_id())
    OR EXISTS (
      SELECT 1 FROM competitions c
      WHERE c.id = competition_gyms.competition_id
        AND c.is_public_leaderboard = true
        AND c.status IN ('active', 'completed')
        AND c.public_slug IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "challenges_select" ON challenges;
CREATE POLICY "challenges_select" ON challenges FOR SELECT
  USING (
    is_admin()
    OR is_user_participant_in_competition(competition_id, get_my_user_id())
    OR EXISTS (
      SELECT 1 FROM competitions c
      WHERE c.id = challenges.competition_id
        AND c.is_public_leaderboard = true
        AND c.status IN ('active', 'completed')
        AND c.public_slug IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "challenge_gym_scores_select" ON challenge_gym_scores;
CREATE POLICY "challenge_gym_scores_select" ON challenge_gym_scores FOR SELECT
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM challenges ch
      WHERE ch.id = challenge_gym_scores.challenge_id
        AND is_user_participant_in_competition(ch.competition_id, get_my_user_id())
    )
    OR EXISTS (
      SELECT 1 FROM challenges ch
      INNER JOIN competitions c ON c.id = ch.competition_id
      WHERE ch.id = challenge_gym_scores.challenge_id
        AND c.is_public_leaderboard = true
        AND c.status IN ('active', 'completed')
        AND c.public_slug IS NOT NULL
    )
  );
