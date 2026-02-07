# Pantallas y Componentes — RisesSystem

Este documento mapea cada pantalla (ruta) con los componentes que la componen. Usar como referencia para saber qué archivos escanear al modificar una pantalla.

---

## Páginas públicas

| Pantalla | Archivo | Componentes usados |
|----------|---------|-------------------|
| Login | `app/login/page.tsx` | `ui/button`, `ui/input`, `ui/label`, `ui/card`, `ui/alert` |
| Register | `app/register/page.tsx` | `ui/button`, `ui/input`, `ui/label`, `ui/card`, `ui/alert` |

---

## Dashboard (Gym Owner)

### Overview
- **Página:** `app/dashboard/page.tsx`
- **Layout:** `app/dashboard/layout.tsx` (pass-through)
- **Componentes disponibles en `components/dashboard/`:**
  - `dashboard-header.tsx` — Header con logo y navegación.
  - `kpi-cards.tsx` — Tarjetas de KPIs (revenue, miembros, check-ins, crecimiento).
  - `sales-chart.tsx` — Gráfico de ventas.
  - `member-insights.tsx` — Insights de miembros.
  - `recent-activity.tsx` — Actividad reciente.
  - `quick-actions.tsx` — Acciones rápidas.
- **Nota:** Actualmente `page.tsx` tiene el header y KPIs inline; los componentes de `components/dashboard/` están disponibles para refactorizar.

### Members
- **Página:** `app/dashboard/members/page.tsx`
- **Componentes en `components/members/`:**
  - `members-header.tsx` — Header con título y botón "Add Member".
  - `members-table.tsx` — Tabla de miembros.
  - `add-member-dialog.tsx` — Diálogo para agregar miembro.

### Trainers
- **Página:** `app/dashboard/trainers/page.tsx`
- **Componentes en `components/trainers/`:**
  - `trainers-header.tsx` — Header con título y botón "Add Trainer".
  - `trainers-table.tsx` — Tabla de entrenadores.
  - `primary-trainer-card.tsx` — Card de entrenador destacado.
  - `add-trainer-dialog.tsx` — Diálogo para agregar entrenador.

### Branches
- **Página:** `app/dashboard/branches/page.tsx`
- **Componentes en `components/branches/`:**
  - `branches-header.tsx` — Header con título y botón "Add Branch".
  - `branches-grid.tsx` — Grid de tarjetas de sucursales.
  - `add-branch-dialog.tsx` — Diálogo para agregar sucursal.

### QR Scanner
- **Página:** `app/dashboard/qr-scanner/page.tsx`
- **Componentes en `components/qr/`:**
  - `qr-scanner.tsx` — Componente de escaneo QR.
  - `check-in-history.tsx` — Historial de check-ins.

### Accounting (Dashboard)
- **Página:** `app/dashboard/accounting/page.tsx`
- **Componentes en `components/accounting/`:**
  - `payments-table.tsx` — Tabla de pagos.
  - `revenue-chart.tsx` — Gráfico de ingresos.
  - `revenue-stats.tsx` — Estadísticas de ingresos.

### Profile
- **Página:** `app/dashboard/profile/page.tsx`
- **Componentes en `components/profile/`:**
  - `gym-owner-profile.tsx` — Formulario/vista del perfil del dueño.

### Settings
- **Página:** `app/dashboard/settings/page.tsx`
- **Componentes:** Usa componentes de `ui/` directamente.

---

## Admin (Super Administrador)

### Dashboard Admin
- **Página:** `app/admin/page.tsx`
- **Layout:** `app/admin/layout.tsx` (incluye `AdminHeader`)
- **Componentes en `components/admin/`:**
  - `admin-header.tsx` — Header del panel admin con navegación.
  - `admin-dashboard-header.tsx` — Header del dashboard admin.
  - `admin-kpi-cards.tsx` — KPIs globales.
  - `active-users-chart.tsx` — Gráfico de usuarios activos.
  - `clients-overview.tsx` — Resumen de clientes (gimnasios).

### Clients
- **Página:** `app/admin/clients/page.tsx`
- **Componentes en `components/admin/clients/`:**
  - `clients-header.tsx` — Header con búsqueda y botón "Add Client".
  - `clients-table.tsx` — Tabla de clientes.
  - `add-client-dialog.tsx` — Diálogo para agregar cliente.

### Analytics
- **Página:** `app/admin/analytics/page.tsx`
- **Componentes en `components/admin/analytics/`:**
  - `analytics-header.tsx` — Header de analytics.
  - `growth-metrics.tsx` — Métricas de crecimiento.
  - `user-growth-chart.tsx` — Gráfico de crecimiento de usuarios.

### Accounting (Admin)
- **Página:** `app/admin/accounting/page.tsx`
- **Componentes en `components/admin/accounting/`:**
  - `accounting-header.tsx` — Header de contabilidad.
  - `payments-table.tsx` — Tabla de pagos global.
  - `revenue-chart.tsx` — Gráfico de ingresos global.
  - `revenue-stats.tsx` — Estadísticas de ingresos global.

---

## Componentes base (UI)

Todos en `components/ui/`. Son componentes de shadcn/ui y no deben modificarse salvo necesidad justificada. Incluyen:

`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input`, `input-otp`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toaster`, `toggle`, `toggle-group`, `tooltip`.

Hooks de UI: `use-mobile.tsx`, `use-toast.ts`.
