# Resumen del Proyecto — RisesSystem

## Qué es
RisesSystem es una plataforma SaaS de gestión de gimnasios. Permite a dueños de gimnasios administrar miembros, entrenadores, sucursales, check-ins por QR y contabilidad. Incluye un panel de administración (super-admin) para gestionar clientes (gimnasios), analytics y contabilidad global.

## Stack principal

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js (App Router) | 16.x |
| UI Library | React | 19.x |
| Lenguaje | TypeScript (strict) | 5.7 |
| Estilos | Tailwind CSS + CSS Variables | 3.4 |
| Componentes UI | shadcn/ui (Radix UI) | — |
| Gráficos | Recharts | 2.15 |
| Formularios | react-hook-form + zod | 7.x / 3.x |
| Iconos | Lucide React | 0.544 |
| Temas | next-themes | 0.4 |
| Base de datos | Neon (PostgreSQL serverless) | — |
| Auth | Supabase Auth (email, OAuth) | — |
| i18n | next-intl | 4.x |
| Backend | Supabase (PostgreSQL, Auth, Storage) | — |
| Fechas | date-fns | 4.x |
| Package manager | pnpm | — |
| App móvil | Expo (SDK 55) + Expo Router | `mobile/` |

## Estado actual
- **Dashboard (gym owner)** y **Accounting** consumen datos reales de Supabase vía Server Actions (`app/actions/payments.ts`, `app/actions/dashboard.ts`): KPIs, gráficos (ventas, membresías, ingresos), actividad reciente y lista de pagos.
- **Otras pantallas** (Members, Branches, Trainers, Plans, Check-ins) también conectadas a Supabase con Server Actions en `app/actions/`.
- **Admin**: panel completo con KPIs, clientes, analytics, accounting, planes de plataforma y notificaciones.
- **Notificaciones**: sistema completo en dashboard y admin con popover, página dedicada, filtros por tipo y lectura/marca como leídas.
- **i18n**: `next-intl` con soporte para `en` y `es`. Server actions usan `getTranslations('errors')`. Componentes usan `useTranslations`. Archivos de traducción: `messages/en.json`, `messages/es.json`.
- **Error handling**: estandarizado en todas las server actions con `getTranslations`.
- **Loading states**: `loading.tsx` en rutas principales (dashboard, admin, members, accounting, plans, trainers, branches, admin/clients).
- **Auth**: Supabase Auth con login/registro, Google OAuth callback, logout, rutas protegidas con locale.
- **Scripts SQL** en `scripts/`; RLS incluye todas las tablas.
- **Build**: compila sin errores TypeScript (`next build` exitoso).
- **App móvil** (`mobile/`): Expo + Supabase Auth (AsyncStorage), navegación por rol (member / trainer / owner / admin), NativeWind (tema Neon Rise), i18n `en`/`es`. Ejecutar `scripts/23-mobile-rls-policies.sql` en Supabase para políticas de miembros y entrenadores. Ver `mobile/README.md`.

## Configuración relevante
- `tsconfig.json`: alias `@/*` → `./*`, target ES6, strict mode.
- `tailwind.config.ts`: darkMode `class`, colores y radios desde variables CSS, plugin `tailwindcss-animate`.
- `next.config.mjs`: imágenes sin optimizar, Turbopack habilitado.
- `components.json`: config de shadcn/ui (estilo default, RSC true, aliases definidos).

## Utilidades (antes en mocks)
- `lib/utils/platform-pricing.ts`: `getPlanForActiveCount`, `getMonthlyPriceBreakdown`, `getMonthlyPrice` para planes de plataforma.
- `lib/types/plans.ts`: tipo `MembershipPlan` para la UI de planes del gym.
- **QR Scanner:** `QRScanner` requiere `resolveScan` para resolver códigos; sin él no hay lookup local.
