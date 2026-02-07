# RisesSystem

Plataforma SaaS de gestión de gimnasios. Permite a dueños de gimnasios administrar miembros, entrenadores, sucursales, check-ins por QR y contabilidad. Incluye un panel de administración para gestionar clientes (gimnasios), analytics y contabilidad global.

---

## De qué trata

- **Dashboard (dueño de gimnasio):** overview con KPIs, gestión de miembros, entrenadores y sucursales, escáner QR para check-in, contabilidad y perfil.
- **Panel Admin:** dashboard global, gestión de clientes (gimnasios), analytics y contabilidad de la plataforma.
- **Login y registro:** flujo de acceso por tipo de usuario (gym owner / administrador); actualmente con datos de demo.

Stack: **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, base de datos preparada con **Neon (PostgreSQL)**. Tema visual "Neon Rise" (oscuro, acentos verde lima).

---

## Cómo correr el proyecto

### Requisitos

- **Node.js** 18+ (recomendado 20+)
- **pnpm** (recomendado) o **npm**

### Instalación

```bash
# Con pnpm (recomendado)
pnpm install

# Con npm (si hay conflictos de dependencias, usar)
npm install --legacy-peer-deps
```

### Desarrollo

```bash
# Con pnpm
pnpm dev

# Con npm
npm run dev
```

La app se abre en **http://localhost:3000**. La ruta `/` redirige a `/dashboard`.

### Build y producción

```bash
# Build
pnpm build   # o: npm run build

# Servidor de producción (después del build)
pnpm start   # o: npm start
```

### Linting

```bash
pnpm lint    # o: npm run lint
```

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
| `components/` | Componentes por dominio y `ui/` (shadcn)        |
| `lib/`      | Utilidades (p. ej. `cn()` para clases CSS)       |
| `hooks/`    | Hooks reutilizables                              |
| `scripts/`  | Scripts SQL para Neon (usuarios, miembros, pagos, check-ins) |
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
