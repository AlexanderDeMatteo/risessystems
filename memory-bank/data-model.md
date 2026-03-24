# Modelo de Datos — RisesSystem

## Proveedor
**Supabase** (PostgreSQL + Auth + Storage + Realtime). Clientes en `lib/supabase/` (browser, server, middleware). Autenticación con Supabase Auth; tabla `public.users` enlazada por `auth_user_id` a `auth.users`.

## Scripts de migración
Ubicados en `scripts/`. Ejecutar en orden (ver `scripts/README.md`). No usar `04` (check_ins ya en 02).

| Script | Tabla(s) / propósito |
|--------|----------------------|
| 01 | `users`, `sessions` |
| 02 | `members`, `check_ins` |
| 03 | `payments`, `revenue_summary` |
| 05 | `branches` |
| 06 | `trainers` |
| 07 | `trainer_members` |
| 08 | `membership_plans` |
| 09 | ALTER `members`: branch_id, auth_user_id |
| 10 | ALTER `trainers`: auth_user_id |
| 11 | ALTER `users`: auth_user_id |
| 13 | ALTER `users`: password_hash nullable |
| 12 | RLS en todas las tablas |
| 14 | Políticas Storage (avatars, exercises, progress-photos) |
| 17 | `platform_subscriptions`, `platform_payments` (gym→platform) |
| 21 | `competitions`, `competition_gyms`, `challenges`, `challenge_gym_scores` + RPC refresh |
| 23 | `get_my_member_id`, `get_my_trainer_id` + RLS para app móvil (miembro/entrenador vía `auth_user_id`) |

---

## Tablas

### users
Dueños de gimnasios y administradores. Vinculados a Supabase Auth por `auth_user_id` (UUID → auth.users.id).

| Columna | Tipo | Notas |
|---------|------|-------|
| id | SERIAL PK | — |
| auth_user_id | UUID UNIQUE | FK implícita a auth.users (opcional) |
| email | VARCHAR(255) UNIQUE | Login principal |
| password_hash | VARCHAR(255) | Nullable si solo se usa Auth |
| name | VARCHAR(255) | Nombre completo |
| gym_name | VARCHAR(255) | Nombre del gimnasio (nullable) |
| role | VARCHAR(50) | `'owner'` (default) o `'admin'` |
| is_active | BOOLEAN | Default `true` |
| created_at | TIMESTAMP | — |
| updated_at | TIMESTAMP | — |

**Índices:** `idx_users_email`, `idx_users_auth_user_id`.

### sessions
Sesiones de autenticación.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | SERIAL PK | — |
| user_id | INTEGER FK → users(id) | ON DELETE CASCADE |
| token | VARCHAR(255) UNIQUE | Token de sesión |
| expires_at | TIMESTAMP | Expiración |
| created_at | TIMESTAMP | — |

**Índices:** `idx_sessions_user_id`, `idx_sessions_token`.

### members
Miembros del gimnasio. Cada miembro pertenece a un user (gym owner).

| Columna | Tipo | Notas |
|---------|------|-------|
| id | SERIAL PK | — |
| user_id | INTEGER FK → users(id) | ON DELETE CASCADE. El dueño del gym. |
| first_name | VARCHAR(255) | — |
| last_name | VARCHAR(255) | — |
| email | VARCHAR(255) | Opcional |
| phone | VARCHAR(20) | Opcional |
| membership_type | VARCHAR(50) | `'premium'`, `'standard'`, `'basic'` |
| status | VARCHAR(50) | `'active'`, `'suspended'`, `'inactive'`. **Por defecto al crear:** `'inactive'`. El gym owner debe cambiar a `'active'` al recibir el pago. |
| join_date | DATE | — |
| expiry_date | DATE | Nullable |
| qr_code | VARCHAR(255) UNIQUE | Código QR para check-in |
| branch_id | INTEGER FK → branches(id) | Opcional (script 09) |
| auth_user_id | UUID | Opcional, para app móvil (script 09) |
| notes | TEXT | — |
| created_at | TIMESTAMP | — |
| updated_at | TIMESTAMP | — |

**Índices:** `idx_members_user_id`, `idx_members_qr_code`, `idx_members_status`, `idx_members_branch_id`.

### check_ins
Registro de entradas/salidas de miembros.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | SERIAL PK | — |
| member_id | INTEGER FK → members(id) | ON DELETE CASCADE |
| check_in_time | TIMESTAMP | Default now |
| check_out_time | TIMESTAMP | Nullable |
| duration_minutes | INTEGER | Calculado al hacer check-out |
| notes | VARCHAR(255) | — |

**Índices:** `idx_checkins_member_id`, `idx_checkins_time`.

### payments
Pagos individuales. Usado por el dashboard (overview y accounting) vía `app/actions/payments.ts` (`getPayments`, `createPayment`). Join a `members` por `member_id` para mostrar nombre en listados.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | SERIAL PK | — |
| user_id | INTEGER FK → users(id) | ON DELETE CASCADE. El gym owner. |
| member_id | INTEGER FK → members(id) | ON DELETE SET NULL. Nullable. |
| amount | DECIMAL(10,2) | — |
| payment_type | VARCHAR(50) | `'membership'`, `'personal_training'`, `'other'` |
| description | VARCHAR(255) | — |
| payment_method | VARCHAR(50) | `'cash'`, `'card'`, `'bank_transfer'` |
| status | VARCHAR(50) | `'pending'`, `'completed'`, `'failed'`, `'refunded'` |
| paid_at | TIMESTAMP | Default now |
| created_at | TIMESTAMP | — |
| updated_at | TIMESTAMP | — |

**Índices:** `idx_payments_user_id`, `idx_payments_member_id`, `idx_payments_date`.

### revenue_summary
Resumen diario de ingresos por gym owner.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | SERIAL PK | — |
| user_id | INTEGER FK → users(id) | ON DELETE CASCADE |
| summary_date | DATE | — |
| daily_revenue | DECIMAL(10,2) | Default 0 |
| membership_fees | DECIMAL(10,2) | Default 0 |
| personal_training | DECIMAL(10,2) | Default 0 |
| other_revenue | DECIMAL(10,2) | Default 0 |
| total_transactions | INTEGER | Default 0 |
| created_at | TIMESTAMP | — |

**Constraint:** UNIQUE(user_id, summary_date).
**Índices:** `idx_revenue_user_id`, `idx_revenue_date`.

### branches
Sedes del gimnasio (script 05).

| Columna | Tipo | Notas |
|---------|------|-------|
| id | SERIAL PK | — |
| user_id | INTEGER FK → users(id) | ON DELETE CASCADE |
| name | VARCHAR(255) | — |
| address | TEXT | Nullable |
| phone | VARCHAR(50) | Nullable |
| email | VARCHAR(255) | Nullable |
| is_active | BOOLEAN | Default true |
| created_at, updated_at | TIMESTAMP | — |

### trainers
Entrenadores (script 06). Opcionalmente asignados a una sede.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | SERIAL PK | — |
| user_id | INTEGER FK → users(id) | ON DELETE CASCADE |
| branch_id | INTEGER FK → branches(id) | ON DELETE SET NULL, nullable |
| name | VARCHAR(255) | — |
| email | VARCHAR(255) | — |
| phone | VARCHAR(50) | Nullable |
| specialties | TEXT | Nullable |
| status | VARCHAR(50) | Default 'active' |
| is_primary | BOOLEAN | Default false |
| hire_date | DATE | Nullable |
| avatar_url | TEXT | Nullable (Storage) |
| auth_user_id | UUID | Opcional (script 10) |
| created_at, updated_at | TIMESTAMP | — |

### trainer_members
Asignación miembro–entrenador (script 07). UNIQUE(trainer_id, member_id).

### membership_plans
Planes de membresía por gym owner (script 08). Conectado a `/dashboard/plans`.

### platform_subscriptions (script 17)
Suscripción activa de un gym owner a un plan de la plataforma.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | SERIAL PK | — |
| user_id | INTEGER FK → users(id) | Gym owner |
| platform_plan_id | INTEGER FK → platform_plans(id) | Plan SaaS |
| status | VARCHAR(50) | `'active'`, `'cancelled'`, `'past_due'` |
| started_at, ended_at | TIMESTAMP | — |
| created_at, updated_at | TIMESTAMP | — |

**Índices:** `idx_platform_subscriptions_user_id`, `idx_platform_subscriptions_status`.

### platform_payments (script 17)
Pagos de gym owners a la plataforma (suscripciones SaaS).

| Columna | Tipo | Notas |
|---------|------|-------|
| id | SERIAL PK | — |
| user_id | INTEGER FK → users(id) | Gym owner |
| amount | DECIMAL(10,2) | — |
| period_start, period_end | DATE | Período facturado |
| status | VARCHAR(50) | `'pending'`, `'completed'`, `'failed'` |
| paid_at | TIMESTAMP | Nullable hasta completar |
| created_at | TIMESTAMP | — |

**Índices:** `idx_platform_payments_user_id`, `idx_platform_payments_status`, `idx_platform_payments_paid_at`.

### Competencias y gamificación (script `21-create-competitions.sql`)

Flujo **admin-controlled** para `scope = 'versus'`: el administrador de plataforma crea la competencia, asigna dos gym owners (`users.id` con `role = 'owner'`) y los retos. Los owners solo ven versus en lectura en el dashboard.

`scope = 'internal'`: el gym owner crea competencias para su propio gimnasio (una fila en `competition_gyms`).

| Tabla | Rol |
|--------|-----|
| `competitions` | Cabecera: `scope`, `status`, fechas, `public_slug`, `is_public_leaderboard`, `winner_user_id`, `created_by_user_id` |
| `competition_gyms` | Participantes: `user_id` (owner), `gym_name_snapshot`, `active_members_snapshot` |
| `challenges` | Retos por competencia: `metric_type` (MVP: `check_in_count`), `normalization`, `points_weight` |
| `challenge_gym_scores` | Agregado por reto y gym: `raw_value`, `normalized_value`, `weighted_points` |

**RPC:** `refresh_competition_scores(competition_id)` recalcula scores desde `check_ins` + `members` en la ventana `starts_at`–`ends_at`. Puede ejecutarlo admin o un participante.

**Público:** RLS permite `SELECT` a `anon`/`authenticated` en competencias con `is_public_leaderboard` y `public_slug` (ruta `/versus/[slug]`).

---

## Diagrama de relaciones

```
users (1) ──→ (N) sessions
users (1) ──→ (N) members
users (1) ──→ (N) payments
users (1) ──→ (N) revenue_summary
users (1) ──→ (N) branches
users (1) ──→ (N) trainers
users (1) ──→ (N) membership_plans
users (1) ──→ (N) platform_subscriptions
users (1) ──→ (N) platform_payments
platform_plans (1) ──→ (N) platform_subscriptions
members (1) ──→ (N) check_ins
members (1) ──→ (N) payments (nullable FK)
members ──→ branch_id (nullable)
trainers ──→ branch_id (nullable)
trainer_members: trainers ↔ members
users (1) ──→ (N) competitions (created_by_user_id)
competitions (1) ──→ (N) competition_gyms
competitions (1) ──→ (N) challenges
challenges (1) ──→ (N) challenge_gym_scores
users (1) ──→ (N) challenge_gym_scores (por gym)
competitions ──→ winner_user_id (nullable)
```

---

## Seguridad y servicios

- **RLS:** Todas las tablas tienen RLS (script 12). Función `get_my_user_id()` devuelve `users.id` del `auth.uid()` actual.
- **Storage:** Buckets `avatars`, `exercises`, `progress-photos` con políticas por carpeta `auth.uid()` (script 14). Ver `memory-bank/storage-setup.md`.
- **Realtime:** Suscripción a `check_ins` para historial en vivo en QR Scanner. Habilitar en Dashboard → Database → Replication. Ver `memory-bank/realtime-setup.md`.

---

## Notas
- Todas las tablas usan `SERIAL` como PK.
- Timestamps con `DEFAULT CURRENT_TIMESTAMP`.
- Relaciones con `ON DELETE CASCADE` salvo donde se indica SET NULL.
- Tipos TypeScript en `lib/types/`. Server Actions en `app/actions/`.
