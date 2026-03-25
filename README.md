# RisesSystem

Plataforma SaaS de gestión de gimnasios. Permite a dueños de gimnasios administrar miembros, entrenadores, sucursales, check-ins por QR y contabilidad. Incluye un panel de administración para gestionar clientes (gimnasios), analytics y contabilidad global.

Este repositorio es un **monorepo**: la **web** vive en la raíz (Next.js) y la **app móvil** en [`mobile/`](mobile/) (Expo). Ambas usan el mismo proyecto **Supabase** (Auth + Postgres con RLS).

---

## De qué trata

- **Dashboard (dueño de gimnasio):** overview con KPIs, gestión de miembros, entrenadores y sucursales, escáner QR para check-in, contabilidad y perfil.
- **Panel Admin:** dashboard global, gestión de clientes (gimnasios), analytics y contabilidad de la plataforma.
- **Login y registro:** flujo de acceso por tipo de usuario (gym owner / administrador); actualmente con datos de demo.
- **App móvil:** clientes Expo para miembros, entrenadores, dueños y admin; mismas credenciales Supabase que la web (detalle en [`mobile/README.md`](mobile/README.md)).

Stack web: **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**. Stack móvil: **Expo** (Expo Router, NativeWind). Base de datos: **Neon (PostgreSQL)** vía Supabase. Tema visual "Neon Rise" (oscuro, acentos verde lima).

---

## Cómo correr el proyecto

### Requisitos

- **Node.js** 18+ (recomendado 20+)
- **pnpm** (recomendado) o **npm** para la web
- **npm** en `mobile/` (ver abajo; en Windows suele hacer falta `npm install --legacy-peer-deps`)
- Para la app móvil: [Expo Go](https://expo.dev/go) en el teléfono o emulador Android / iOS

### Web (Next.js) — raíz del repo

**Instalación**

```bash
# Con pnpm (recomendado)
pnpm install

# Con npm (si hay conflictos de dependencias, usar)
npm install --legacy-peer-deps
```

Configura `.env` en la raíz (p. ej. `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, etc., según lo que use tu despliegue).

**Desarrollo**

```bash
# Con pnpm
pnpm dev

# Con npm
npm run dev
```

La app se abre en **http://localhost:3000**. La ruta `/` redirige a `/dashboard`.

**Build y producción**

```bash
# Build
pnpm build   # o: npm run build

# Servidor de producción (después del build)
pnpm start   # o: npm start
```

**Linting**

```bash
pnpm lint    # o: npm run lint
```

### App móvil (Expo) — carpeta `mobile/`

1. En Supabase (SQL Editor), aplica las políticas RLS para móvil si aún no lo hiciste: [`scripts/23-mobile-rls-policies.sql`](scripts/23-mobile-rls-policies.sql).
2. Crea `mobile/.env` con `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY` (mismos valores que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en la raíz).
3. Instala y arranca Metro:

```bash
cd mobile
npm install --legacy-peer-deps
npx expo start
```

4. Abrir en **nativo**:
   - **Android emulator (Windows/macOS/Linux):** con el emulador ya iniciado, presiona `a` en la terminal de Expo.
   - **Expo Go (teléfono):** escanea el QR o ingresa manualmente la URL `exp://<tu-ip-local>:<puerto>`.

> Nota rápida de operación: si al correr `npx expo start` el puerto 8081 está ocupado (prompt no interactivo), arranca directo con `npx expo start --port 8083`.

Más detalle (roles, stack): [`mobile/README.md`](mobile/README.md).

### Correr web y móvil a la vez

Usa **dos terminales** desde la raíz del repo:

| Terminal | Comando |
|----------|---------|
| 1 — Web | `pnpm dev` o `npm run dev` (en la raíz) |
| 2 — Móvil | `cd mobile` → `npx expo start` (tras `npm install --legacy-peer-deps` la primera vez) |

La web en **http://localhost:3000**; Expo abre el dev server y el QR para Expo Go o atajos para emulador.

---

## Desplegar en Vercel

El repo está en [github.com/AlexanderDeMatteo/risessystems](https://github.com/AlexanderDeMatteo/risessystems). Sigue estos pasos:

1. **Conecta el repo con Vercel**
   - Entra en [vercel.com/new](https://vercel.com/new) e inicia sesión (con GitHub es lo más rápido).
   - En **Import Git Repository** elige **AlexanderDeMatteo/risessystems** (o busca `risessystems`).
   - Si no lo ves, haz **Configure GitHub App** y autoriza el acceso al repo.
   - Deja **Framework Preset: Next.js** y **Root Directory** vacío. Pulsa **Deploy** (puedes hacer el primer deploy sin variables para probar).

2. **Añade la base de datos (necesario para login y datos)**
   - En el proyecto de Vercel: **Settings** → **Environment Variables**.
   - Añade:
     - **Name:** `DATABASE_URL`
     - **Value:** tu connection string de Neon (desde [Neon Console](https://console.neon.tech) → tu proyecto → Connection string; suele terminar en `?sslmode=require`).
   - Marca **Production**, **Preview** y **Development**.
   - Guarda y en **Deployments** haz **Redeploy** del último deployment para que use la variable.

3. **Siguientes despliegues**
   - Cada **push a la rama `main`** en GitHub dispara un deploy automático en Vercel.

### Desplegar desde la terminal (CLI)

1. Inicia sesión una vez: `npx vercel login` (se abre el navegador).
2. Despliega a producción: `npx vercel --prod` o `npm run deploy`.
3. Añadir `DATABASE_URL` por CLI (opcional):  
   `npx vercel env add DATABASE_URL` → pega la connection string de Neon y elige Production, Preview y Development. Luego: **Deployments** → Redeploy.

---

## Estructura básica

| Carpeta      | Descripción                                      |
|-------------|---------------------------------------------------|
| `app/`      | Rutas Next.js: `dashboard/`, `admin/`, `login/`, `register/` |
| `mobile/`   | App Expo (Expo Router, Supabase Auth, roles miembro / entrenador / owner / admin) |
| `components/` | Componentes por dominio y `ui/` (shadcn)        |
| `lib/`      | Utilidades (p. ej. `cn()` para clases CSS)       |
| `hooks/`    | Hooks reutilizables                              |
| `scripts/`  | Scripts SQL para Neon (usuarios, miembros, pagos, check-ins, RLS móvil `23-…`) |
| `memory-bank/` | Documentación del proyecto (arquitectura, diseño, convenciones) |

---

## Documentación

La documentación detallada está en la carpeta **`memory-bank/`**:

- `project-summary.md` — Resumen del proyecto y stack
- `architecture.md` — Estructura de carpetas y rutas
- `screens-and-components.md` — Mapa de pantallas y componentes
- `design-system.md` — Tema "Neon Rise" y patrones de UI
- `data-model.md` — Modelo de datos (tablas, relaciones)
- `conventions.md` — Convenciones de código

---

## Licencia

Proyecto privado. Todos los derechos reservados.
