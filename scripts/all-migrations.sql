-- =============================================================================
-- RisesSystem: all migrations in one file
-- Run this in Supabase Dashboard → SQL Editor (New query → paste → Run)
-- Order: 01 → 02 → 03 → 05 → 06 → 07 → 08 → 09 → 10 → 11 → 13 → 12 → 15 → 16 → 17 → 14
-- Before running 14: create Storage buckets (avatars, exercises, progress-photos) in Dashboard → Storage.
-- =============================================================================

-- === 01-create-users-table.sql ===
-- Create users table for RisesSystem authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  gym_name VARCHAR(255),
  phone VARCHAR(20),
  location VARCHAR(255),
  role VARCHAR(50) DEFAULT 'owner',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create sessions table for session management
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for session queries
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);

-- === 02-create-members-table.sql ===
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

-- === 03-create-accounting-table.sql ===
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

-- === 05-create-branches-table.sql ===
-- Branches (gym locations) per gym owner
CREATE TABLE IF NOT EXISTS branches (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_branches_user_id ON branches(user_id);
CREATE INDEX IF NOT EXISTS idx_branches_is_active ON branches(is_active);

-- === 06-create-trainers-table.sql ===
-- Trainers per gym owner, optionally assigned to a branch
CREATE TABLE IF NOT EXISTS trainers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  specialties TEXT,
  status VARCHAR(50) DEFAULT 'active',
  is_primary BOOLEAN DEFAULT false,
  hire_date DATE,
  avatar_url TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trainers_user_id ON trainers(user_id);
CREATE INDEX IF NOT EXISTS idx_trainers_branch_id ON trainers(branch_id);
CREATE INDEX IF NOT EXISTS idx_trainers_status ON trainers(status);

-- === 07-create-trainer-members-table.sql ===
-- Assignment of members to trainers (e.g. personal training)
CREATE TABLE IF NOT EXISTS trainer_members (
  id SERIAL PRIMARY KEY,
  trainer_id INTEGER NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  UNIQUE(trainer_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_trainer_members_trainer_id ON trainer_members(trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_members_member_id ON trainer_members(member_id);

-- === 08-create-membership-plans-table.sql ===
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

-- === 09-alter-members-for-supabase.sql ===
-- Optional: link member to a branch and to Supabase Auth (for future app/mobile login)
ALTER TABLE members ADD COLUMN IF NOT EXISTS branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL;
ALTER TABLE members ADD COLUMN IF NOT EXISTS auth_user_id UUID;

CREATE INDEX IF NOT EXISTS idx_members_branch_id ON members(branch_id);
CREATE INDEX IF NOT EXISTS idx_members_auth_user_id ON members(auth_user_id);

-- === 10-alter-trainers-for-supabase.sql ===
-- Optional: link trainer to Supabase Auth (for future app/mobile)
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS auth_user_id UUID;

CREATE INDEX IF NOT EXISTS idx_trainers_auth_user_id ON trainers(auth_user_id);

-- === 11-alter-users-for-supabase.sql ===
-- Link app users to Supabase Auth (required for RLS and Fase 3 login)
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;

CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);

-- === 13-alter-users-password-optional.sql ===
-- Allow Supabase Auth users: no password stored in public.users
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- === 12-enable-rls.sql ===
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

-- === 15-add-admin-rls.sql ===
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

-- === 16-create-platform-plans.sql ===
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

-- === 14-storage-policies.sql ===
-- Storage RLS: allow authenticated users to manage their own files in each bucket.
-- Create the buckets first in Supabase Dashboard: Storage → New bucket → avatars, exercises, progress-photos.
-- Make "avatars" public if you want direct image URLs; keep others private and use signed URLs.

-- Avatars: users can only read/write files under their own folder (auth.uid())
CREATE POLICY "avatars_insert_own"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "avatars_select_own"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "avatars_update_own"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "avatars_delete_own"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (auth.uid())::text);

-- Exercises: same pattern (gym owner uploads under their auth.uid() folder)
CREATE POLICY "exercises_insert_own"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'exercises' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "exercises_select_own"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'exercises' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "exercises_update_own"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'exercises' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "exercises_delete_own"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'exercises' AND (storage.foldername(name))[1] = (auth.uid())::text);

-- Progress photos: same pattern
CREATE POLICY "progress_photos_insert_own"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "progress_photos_select_own"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "progress_photos_update_own"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "progress_photos_delete_own"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = (auth.uid())::text);

-- === 17-platform-subscriptions.sql ===
-- Platform subscriptions and payments: what gym owners pay to the platform.
-- Run after 16-create-platform-plans.sql and 15-add-admin-rls.sql.

CREATE TABLE IF NOT EXISTS platform_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform_plan_id INTEGER NOT NULL REFERENCES platform_plans(id) ON DELETE RESTRICT,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_platform_subscriptions_user_id ON platform_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_subscriptions_status ON platform_subscriptions(status);

CREATE TABLE IF NOT EXISTS platform_payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_platform_payments_user_id ON platform_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_payments_status ON platform_payments(status);
CREATE INDEX IF NOT EXISTS idx_platform_payments_paid_at ON platform_payments(paid_at);

ALTER TABLE platform_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "platform_subscriptions_select_own" ON platform_subscriptions FOR SELECT
  USING (user_id = get_my_user_id() OR is_admin());
CREATE POLICY "platform_subscriptions_insert_admin" ON platform_subscriptions FOR INSERT
  WITH CHECK (is_admin());
CREATE POLICY "platform_subscriptions_update_admin" ON platform_subscriptions FOR UPDATE
  USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "platform_subscriptions_delete_admin" ON platform_subscriptions FOR DELETE
  USING (is_admin());

CREATE POLICY "platform_payments_select_own" ON platform_payments FOR SELECT
  USING (user_id = get_my_user_id() OR is_admin());
CREATE POLICY "platform_payments_insert_admin" ON platform_payments FOR INSERT
  WITH CHECK (is_admin());
CREATE POLICY "platform_payments_update_admin" ON platform_payments FOR UPDATE
  USING (is_admin()) WITH CHECK (is_admin());

-- === 18-add-phone-location-to-users.sql ===
-- Add phone and location columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(255);

-- === 19-create-user-settings.sql ===
-- User settings for preferences (color scheme, notifications, regional)
CREATE TABLE IF NOT EXISTS user_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  color_scheme VARCHAR(30) DEFAULT 'neon-acid',
  notify_expiring BOOLEAN DEFAULT true,
  notify_payments BOOLEAN DEFAULT true,
  notify_checkins BOOLEAN DEFAULT true,
  notify_new_members BOOLEAN DEFAULT true,
  currency VARCHAR(10) DEFAULT 'USD',
  timezone VARCHAR(50) DEFAULT 'America/Mexico_City',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_settings_all_own" ON user_settings FOR ALL
  USING (user_id = get_my_user_id());

CREATE POLICY "user_settings_select_admin" ON user_settings FOR SELECT
  USING (is_admin());
