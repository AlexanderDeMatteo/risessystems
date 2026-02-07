# Arquitectura — RisesSystem

## Estructura de carpetas

```
risessistem/
├── app/                        # Rutas (Next.js App Router)
│   ├── layout.tsx              # Layout raíz (fuentes, clase dark, meta)
│   ├── globals.css             # Variables CSS del tema + utilidades
│   ├── page.tsx                # "/" → redirect a /dashboard
│   ├── login/page.tsx          # Página de login
│   ├── register/page.tsx       # Página de registro
│   ├── dashboard/              # Zona del dueño de gimnasio
│   │   ├── layout.tsx          # Layout del dashboard (pass-through)
│   │   ├── page.tsx            # Dashboard principal (overview)
│   │   ├── members/page.tsx
│   │   ├── trainers/page.tsx
│   │   ├── branches/page.tsx
│   │   ├── qr-scanner/page.tsx
│   │   ├── accounting/page.tsx
│   │   ├── profile/page.tsx
│   │   └── settings/page.tsx
│   └── admin/                  # Zona de administración (super-admin)
│       ├── layout.tsx          # Layout admin (con AdminHeader)
│       ├── page.tsx            # Dashboard admin
│       ├── clients/page.tsx
│       ├── analytics/page.tsx
│       └── accounting/page.tsx
├── components/                 # Componentes React
│   ├── ui/                     # Componentes base shadcn/ui (Button, Card, Dialog, etc.)
│   ├── dashboard/              # Componentes del dashboard gym
│   ├── admin/                  # Componentes del panel admin
│   │   ├── accounting/
│   │   ├── analytics/
│   │   └── clients/
│   ├── members/                # Tabla, header, diálogo de miembros
│   ├── trainers/               # Tabla, cards, diálogo de entrenadores
│   ├── branches/               # Grid, header, diálogo de sucursales
│   ├── accounting/             # Tabla pagos, gráficos revenue
│   ├── profile/                # Perfil del gym owner
│   ├── qr/                     # Scanner QR y historial check-ins
│   └── theme-provider.tsx      # Wrapper de next-themes
├── lib/                        # Utilidades
│   └── utils.ts                # Función cn() (clsx + tailwind-merge)
├── hooks/                      # Hooks reutilizables
│   ├── use-mobile.tsx          # Detección de viewport móvil
│   └── use-toast.ts            # Hook para toasts
├── scripts/                    # Migraciones SQL (Neon/PostgreSQL)
│   ├── 01-create-users-table.sql
│   ├── 02-create-members-table.sql
│   ├── 03-create-accounting-table.sql
│   └── 04-create-checkins-table.sql
├── public/                     # Assets estáticos
├── styles/                     # Globals.css adicional (legacy)
└── memory-bank/                # Documentación del proyecto
```

## Rutas y roles

### Públicas (sin autenticación)
- `/login` — Selección de tipo (gym owner / admin), email, password.
- `/register` — Registro de gym owner.

### Dashboard — Gym Owner
- `/dashboard` — Overview con KPIs, estadísticas, acciones rápidas.
- `/dashboard/members` — CRUD de miembros del gimnasio.
- `/dashboard/trainers` — Gestión de entrenadores.
- `/dashboard/branches` — Sucursales del gimnasio.
- `/dashboard/qr-scanner` — Escaneo QR para check-in de miembros.
- `/dashboard/accounting` — Contabilidad: pagos, ingresos, gráficos.
- `/dashboard/profile` — Perfil del dueño.
- `/dashboard/settings` — Configuración del gimnasio.

### Admin — Super Administrador
- `/admin` — Dashboard con KPIs globales, gráficos de usuarios activos, overview de clientes.
- `/admin/clients` — Gestión de gimnasios (clientes de la plataforma).
- `/admin/analytics` — Métricas de crecimiento, gráficos.
- `/admin/accounting` — Contabilidad global de la plataforma.

## Flujo de navegación actual

```
/ (redirect) → /dashboard
                ├── members
                ├── trainers
                ├── branches
                ├── qr-scanner
                ├── accounting
                ├── profile
                └── settings

/login → selección tipo → /dashboard (gym) o /admin (admin)

/admin
  ├── clients
  ├── analytics
  └── accounting
```

## Capas (futuro)

Cuando se implementen API routes y conexión a BD:

```
page.tsx (UI) → components/ (presentación) → app/api/ (route handlers) → lib/db (Neon) → PostgreSQL
```

Actualmente todo es frontend con datos de demo.
