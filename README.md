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

1. **Sube el proyecto a GitHub** (si aún no está):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TU_USUARIO/risessistem.git
   git push -u origin main
   ```

2. **Conecta con Vercel:**
   - Entra en [vercel.com](https://vercel.com) e inicia sesión (o con GitHub).
   - **Add New** → **Project** y selecciona el repositorio `risessistem`.
   - Vercel detectará Next.js automáticamente. No cambies el **Framework Preset**.

3. **Variables de entorno (importante):**
   - En la configuración del proyecto, ve a **Settings** → **Environment Variables**.
   - Añade:
     - **Name:** `DATABASE_URL`  
     - **Value:** tu connection string de Neon (ej: `postgres://user:pass@host.neon.tech/neondb?sslmode=require`).  
   - Asígnale **Production**, **Preview** y **Development** si quieres usarla en todos los entornos.

4. **Deploy:**
   - Pulsa **Deploy**. Cada push a `main` generará un nuevo despliegue.

**Nota:** Si usas npm en lugar de pnpm, en Vercel puedes dejar el build por defecto (`npm run build`) o en **Settings** → **General** configurar **Package Manager** a `npm`.

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
