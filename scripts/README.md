# SQL scripts (Supabase / PostgreSQL)

Run in **Supabase Dashboard → SQL Editor** in this order:

| Order | Script | Description |
|-------|--------|-------------|
| 1 | `01-create-users-table.sql` | users, sessions |
| 2 | `02-create-members-table.sql` | members, check_ins |
| 3 | `03-create-accounting-table.sql` | payments, revenue_summary |
| 4 | `05-create-branches-table.sql` | branches |
| 5 | `06-create-trainers-table.sql` | trainers |
| 6 | `07-create-trainer-members-table.sql` | trainer_members |
| 7 | `08-create-membership-plans-table.sql` | membership_plans |
| 8 | `09-alter-members-for-supabase.sql` | members: branch_id, auth_user_id |
| 9 | `10-alter-trainers-for-supabase.sql` | trainers: auth_user_id |
| 10 | `11-alter-users-for-supabase.sql` | users: auth_user_id (for RLS + Auth) |
| 11 | `13-alter-users-password-optional.sql` | users: password_hash nullable (for Supabase Auth) |
| 12 | `12-enable-rls.sql` | RLS + policies (run after Auth is configured) |
| 13 | `15-add-admin-rls.sql` | Admin read access: is_admin(), SELECT policies for admin role |
| 14 | `16-create-platform-plans.sql` | platform_plans table and RLS (admin manage, authenticated read) |
| 15 | `17-platform-subscriptions.sql` | platform_subscriptions, platform_payments (gym→platform revenue) |
| 16 | `14-storage-policies.sql` | Storage RLS for avatars, exercises, progress-photos |

**Note:** `04-create-checkins-table.sql` is not used; check_ins is already created in `02-create-members-table.sql`. Skip script 04.

**Storage:** Create buckets `avatars`, `exercises`, `progress-photos` in Supabase Dashboard (Storage → New bucket) before running `14-storage-policies.sql`. Optionally set `avatars` to **Public** for direct image URLs.

Run `13` before using Register (Supabase Auth). Run `12-enable-rls.sql` after Auth so `get_my_user_id()` can resolve from `auth.uid()`.
