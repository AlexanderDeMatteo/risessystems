# RisesSystem — Mobile (Expo)

React Native app for members, trainers, gym owners, and platform admins. Uses the same Supabase project as the Next.js web app.

To run **web and mobile together** (two terminals), see the root [`README.md`](../README.md).

## Setup

1. Copy environment variables from the web project:

   ```bash
   cp .env.example .env
   ```

   Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` (same values as `NEXT_PUBLIC_*` in the repo root `.env`).

2. Apply database policies for mobile (run in Supabase SQL Editor):

   - [`../scripts/23-mobile-rls-policies.sql`](../scripts/23-mobile-rls-policies.sql)

3. Install and start:

   ```bash
   npm install --legacy-peer-deps
   npx expo start
   ```

## Roles

After login, the app resolves the role from `public.users`, `public.trainers`, or `public.members` using `auth_user_id = auth.uid()`.

- **Owner / Admin:** rows in `users` with `role` `owner` or `admin`.
- **Trainer:** row in `trainers` with `auth_user_id` set (link in web panel).
- **Member:** row in `members` with `auth_user_id` set (link in web panel).

## Stack

- Expo SDK 55, Expo Router, TypeScript
- Supabase Auth + Postgres (RLS)
- NativeWind v4 + Tailwind (theme aligned with web “Neon Rise”)
- i18next + expo-localization (`en` / `es`)
