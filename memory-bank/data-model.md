# Modelo de Datos — RisesSystem

## Proveedor
**Neon** (PostgreSQL serverless). Paquete: `@neondatabase/serverless`.

## Scripts de migración
Ubicados en `scripts/`, numerados para ejecutar en orden:

| Script | Tabla(s) |
|--------|----------|
| `01-create-users-table.sql` | `users`, `sessions` |
| `02-create-members-table.sql` | `members`, `check_ins` |
| `03-create-accounting-table.sql` | `payments`, `revenue_summary` |
| `04-create-checkins-table.sql` | (Nota: `check_ins` ya está en 02; revisar si este script agrega algo adicional) |

---

## Tablas

### users
Almacena dueños de gimnasios y administradores.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | SERIAL PK | — |
| email | VARCHAR(255) UNIQUE | Login principal |
| password_hash | VARCHAR(255) | Hash con bcrypt |
| name | VARCHAR(255) | Nombre completo |
| gym_name | VARCHAR(255) | Nombre del gimnasio (nullable) |
| role | VARCHAR(50) | `'owner'` (default) o `'admin'` |
| is_active | BOOLEAN | Default `true` |
| created_at | TIMESTAMP | — |
| updated_at | TIMESTAMP | — |

**Índice:** `idx_users_email` sobre `email`.

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
| status | VARCHAR(50) | `'active'`, `'suspended'`, `'inactive'` |
| join_date | DATE | — |
| expiry_date | DATE | Nullable |
| qr_code | VARCHAR(255) UNIQUE | Código QR para check-in |
| notes | TEXT | — |
| created_at | TIMESTAMP | — |
| updated_at | TIMESTAMP | — |

**Índices:** `idx_members_user_id`, `idx_members_qr_code`, `idx_members_status`.

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
Pagos individuales.

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

---

## Diagrama de relaciones

```
users (1) ──→ (N) sessions
users (1) ──→ (N) members
users (1) ──→ (N) payments
users (1) ──→ (N) revenue_summary
members (1) ──→ (N) check_ins
members (1) ──→ (N) payments (nullable FK)
```

---

## Tablas planeadas (no implementadas)

### membership_plans
Gestión de planes de membresía por gym owner. Diseñada para integración futura.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | SERIAL PK | — |
| user_id | INTEGER FK → users(id) | ON DELETE CASCADE |
| name | VARCHAR(100) | Nombre del plan |
| description | TEXT | Opcional |
| price | DECIMAL(10,2) | Precio |
| duration_days | INTEGER | 30, 90, 365... |
| is_active | BOOLEAN | Default true |
| created_at, updated_at | TIMESTAMP | — |

**Frontend:** La pestaña Plans (`/dashboard/plans`) usa datos mock. Ver `components/plans/`.

---

## Notas
- Todas las tablas usan `SERIAL` como PK (autoincremental).
- Timestamps con `DEFAULT CURRENT_TIMESTAMP`.
- Las relaciones usan `ON DELETE CASCADE` salvo `payments.member_id` que usa `ON DELETE SET NULL`.
- Nuevas tablas deben seguir el mismo patrón: script numerado en `scripts/`, FK con cascada, índices en columnas de búsqueda frecuente.
