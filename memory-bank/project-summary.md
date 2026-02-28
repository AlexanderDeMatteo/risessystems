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
| Auth (planeado) | bcrypt (hash passwords) | 6.x |
| Fetching | SWR | 2.x |
| Fechas | date-fns | 4.x |
| Package manager | pnpm | — |

## Estado actual
- **Dashboard (gym owner)** y **Accounting** consumen datos reales de Supabase vía Server Actions (`app/actions/payments.ts`, `app/actions/dashboard.ts`): KPIs, gráficos (ventas, membresías, ingresos), actividad reciente y lista de pagos. Overview y contabilidad ya no usan mocks.
- **Otras pantallas** (Members, Branches, Trainers, Plans, Check-ins) también conectadas a Supabase con Server Actions en `app/actions/`.
- **Admin** y **login/registro**: según implementación actual (Auth con Supabase; admin puede usar datos de demo o propios).
- **Scripts SQL** en `scripts/`; RLS (script 12) incluye `payments` y tablas del dashboard.
- **ThemeProvider** existe en `components/theme-provider.tsx`; tema dark por defecto en `<html>`.

## Configuración relevante
- `tsconfig.json`: alias `@/*` → `./*`, target ES6, strict mode.
- `tailwind.config.ts`: darkMode `class`, colores y radios desde variables CSS, plugin `tailwindcss-animate`.
- `next.config.mjs`: `ignoreBuildErrors: true` (temporal), imágenes sin optimizar, Turbopack habilitado.
- `components.json`: config de shadcn/ui (estilo default, RSC true, aliases definidos).
