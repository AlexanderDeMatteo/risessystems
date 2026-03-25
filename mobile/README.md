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

## Run native (recommended)

### Android emulator (Windows)

1. Install Android Studio + Android SDK + Virtual Device.
2. Start an emulator from Device Manager.
3. In Expo terminal, press `a` (or run `npx expo start --android`).

### Physical phone (Expo Go)

1. Keep Metro running (`npx expo start`).
2. Open Expo Go and scan the QR.
3. If QR does not render in Cursor terminal, use **Enter URL manually** with:
   - `exp://<your-local-ip>:8081`
   - or `exp://<your-local-ip>:8083` if you started Expo on that port.

### Common issues

- `Cannot determine the project's Expo SDK version`:
  - You started Expo from the repo root. Run from `mobile/`.
- `supabaseUrl is required`:
  - `mobile/.env` is missing `EXPO_PUBLIC_SUPABASE_URL` and/or `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Port 8081 already in use in non-interactive mode:
  - Start with `npx expo start --port 8083`.
- Tunnel asks for ngrok package:
  - Install locally in `mobile/`: `npm install -D @expo/ngrok@^4.1.0 --legacy-peer-deps`.
- `ngrok tunnel took too long to connect`:
  - Usually network/firewall/proxy blocks tunnel. Try LAN mode (`npx expo start`) or allow ngrok/node in firewall.

## Roles

After login, the app resolves the role from `public.users`, `public.trainers`, or `public.members` using `auth_user_id = auth.uid()`.

- **Owner / Admin:** rows in `users` with `role` `owner` or `admin`.
- **Trainer:** row in `trainers` with `auth_user_id` set (link in web panel).
- **Member:** row in `members` with `auth_user_id` set (link in web panel).

## Stack

- Expo SDK 54, Expo Router, TypeScript
- Supabase Auth + Postgres (RLS)
- NativeWind v4 + Tailwind (theme aligned with web “Neon Rise”)
- i18next + expo-localization (`en` / `es`)
