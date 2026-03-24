-- Competitions (internal + versus), challenges, gym scores, RLS, refresh RPC.
-- Run after 15-add-admin-rls.sql (needs is_admin). Append to all-migrations.sql after 20.

CREATE TABLE IF NOT EXISTS competitions (
  id SERIAL PRIMARY KEY,
  created_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scope VARCHAR(20) NOT NULL CHECK (scope IN ('internal', 'versus')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  starts_at TIMESTAMP NOT NULL,
  ends_at TIMESTAMP NOT NULL,
  public_slug VARCHAR(100) UNIQUE,
  is_public_leaderboard BOOLEAN NOT NULL DEFAULT false,
  winner_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_competitions_scope ON competitions(scope);
CREATE INDEX IF NOT EXISTS idx_competitions_status ON competitions(status);
CREATE INDEX IF NOT EXISTS idx_competitions_created_by ON competitions(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_competitions_public_slug ON competitions(public_slug) WHERE public_slug IS NOT NULL;

CREATE TABLE IF NOT EXISTS competition_gyms (
  id SERIAL PRIMARY KEY,
  competition_id INTEGER NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gym_name_snapshot VARCHAR(255) NOT NULL,
  active_members_snapshot INTEGER NOT NULL DEFAULT 0,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(competition_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_competition_gyms_competition_id ON competition_gyms(competition_id);
CREATE INDEX IF NOT EXISTS idx_competition_gyms_user_id ON competition_gyms(user_id);

CREATE TABLE IF NOT EXISTS challenges (
  id SERIAL PRIMARY KEY,
  competition_id INTEGER NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  metric_type VARCHAR(30) NOT NULL DEFAULT 'check_in_count',
  normalization VARCHAR(20) NOT NULL DEFAULT 'raw' CHECK (normalization IN ('raw', 'per_active_member')),
  points_weight NUMERIC(5, 2) NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_challenges_competition_id ON challenges(competition_id);

CREATE TABLE IF NOT EXISTS challenge_gym_scores (
  id SERIAL PRIMARY KEY,
  challenge_id INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  raw_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
  normalized_value NUMERIC(12, 4) NOT NULL DEFAULT 0,
  weighted_points NUMERIC(12, 4) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(challenge_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_challenge_gym_scores_challenge_id ON challenge_gym_scores(challenge_id);

-- Participant check bypassing RLS (avoids infinite recursion when policies SELECT competition_gyms)
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

-- Recalculate scores from check_ins (MVP: check_in_count only)
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

GRANT EXECUTE ON FUNCTION refresh_competition_scores(INTEGER) TO authenticated;

ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_gym_scores ENABLE ROW LEVEL SECURITY;

-- competitions
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

CREATE POLICY "competitions_insert" ON competitions FOR INSERT
  WITH CHECK (
    is_admin()
    OR (
      scope = 'internal'
      AND created_by_user_id = get_my_user_id()
    )
  );

CREATE POLICY "competitions_update" ON competitions FOR UPDATE
  USING (
    is_admin()
    OR (
      scope = 'internal'
      AND created_by_user_id = get_my_user_id()
    )
  )
  WITH CHECK (
    is_admin()
    OR (
      scope = 'internal'
      AND created_by_user_id = get_my_user_id()
    )
  );

CREATE POLICY "competitions_delete" ON competitions FOR DELETE
  USING (
    is_admin()
    OR (
      scope = 'internal'
      AND created_by_user_id = get_my_user_id()
      AND status = 'draft'
    )
  );

-- competition_gyms
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

CREATE POLICY "competition_gyms_insert" ON competition_gyms FOR INSERT
  WITH CHECK (
    is_admin()
    OR (
      user_id = get_my_user_id()
      AND EXISTS (
        SELECT 1 FROM competitions c
        WHERE c.id = competition_id
          AND c.scope = 'internal'
          AND c.created_by_user_id = get_my_user_id()
      )
    )
  );

CREATE POLICY "competition_gyms_update" ON competition_gyms FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "competition_gyms_delete" ON competition_gyms FOR DELETE
  USING (
    is_admin()
    OR (
      user_id = get_my_user_id()
      AND EXISTS (
        SELECT 1 FROM competitions c
        WHERE c.id = competition_gyms.competition_id
          AND c.scope = 'internal'
          AND c.created_by_user_id = get_my_user_id()
          AND c.status = 'draft'
      )
    )
  );

-- challenges
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

CREATE POLICY "challenges_insert" ON challenges FOR INSERT
  WITH CHECK (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM competitions c
      WHERE c.id = competition_id
        AND c.scope = 'internal'
        AND c.created_by_user_id = get_my_user_id()
        AND c.status = 'draft'
    )
  );

CREATE POLICY "challenges_update" ON challenges FOR UPDATE
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM competitions c
      WHERE c.id = challenges.competition_id
        AND c.scope = 'internal'
        AND c.created_by_user_id = get_my_user_id()
        AND c.status = 'draft'
    )
  )
  WITH CHECK (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM competitions c
      WHERE c.id = competition_id
        AND c.scope = 'internal'
        AND c.created_by_user_id = get_my_user_id()
        AND c.status = 'draft'
    )
  );

CREATE POLICY "challenges_delete" ON challenges FOR DELETE
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM competitions c
      WHERE c.id = challenges.competition_id
        AND c.scope = 'internal'
        AND c.created_by_user_id = get_my_user_id()
        AND c.status = 'draft'
    )
  );

-- challenge_gym_scores (direct writes only admin; participants use refresh_competition_scores)
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

CREATE POLICY "challenge_gym_scores_admin_all" ON challenge_gym_scores FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
