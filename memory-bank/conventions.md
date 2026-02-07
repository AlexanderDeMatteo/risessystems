# Convenciones de Código — RisesSystem

## Componentes React

### Server vs Client Components
- **Por defecto:** los componentes son Server Components (Next.js App Router).
- Usar `'use client'` solo cuando sea necesario: estado (`useState`), efectos (`useEffect`), eventos del navegador, hooks de router (`useRouter`, `usePathname`), etc.
- Los `page.tsx` pueden ser Server Components si no usan estado ni interactividad directa; la interactividad se delega a componentes hijos con `'use client'`.

### Estructura de componentes
- Un componente por archivo.
- Nombre del archivo en kebab-case: `add-member-dialog.tsx`.
- Nombre del componente en PascalCase: `AddMemberDialog`.
- Export nombrado (no default) para componentes reutilizables: `export function AddMemberDialog() {}`.
- Export default solo para páginas (`page.tsx`) y layouts (`layout.tsx`).

### Ubicación
- Componentes de dominio en `components/{dominio}/` (ej. `components/members/`).
- Componentes base en `components/ui/` (shadcn — no modificar sin justificación).
- Hooks reutilizables en `hooks/`.
- Utilidades en `lib/`.

---

## Imports

- Siempre usar alias `@/`:

```typescript
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useMobile } from '@/hooks/use-mobile'
```

- Orden de imports (sin herramienta de auto-sort por ahora):
  1. React / Next.js
  2. Librerías externas (lucide-react, recharts, etc.)
  3. Componentes UI (`@/components/ui/`)
  4. Componentes de dominio (`@/components/{dominio}/`)
  5. Utilidades y hooks (`@/lib/`, `@/hooks/`)
  6. Tipos

---

## Estilos

- **Tailwind + tokens semánticos** (ver `design-system.md`).
- Para clases condicionales usar `cn()` de `@/lib/utils`.
- No usar `style={{}}` inline salvo excepciones justificadas.
- No usar CSS Modules.
- Clases nuevas del tema: definir en `app/globals.css` dentro de `@layer components`.

---

## Formularios

### Estándar recomendado
- **react-hook-form** + **zod** para validación de esquemas.
- Componentes de formulario de shadcn (`Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`).

### Formularios simples (excepción permitida)
- Para formularios de 2-3 campos sin validación compleja se permite `useState` + inputs controlados + validación manual.
- Ejemplo: diálogos rápidos como `AddMemberDialog` (estado actual).

### Patrón de formularios

```typescript
// Esquema con zod
const formSchema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
})

// Hook
const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { name: '', email: '' },
})
```

---

## Iconos

- Librería: **Lucide React** (`lucide-react`).
- Import directo del icono: `import { Users, Dumbbell } from 'lucide-react'`.
- Tamaños comunes: `w-4 h-4` (inline), `w-5 h-5` (nav/actions), `w-8 h-8` (hero).

---

## Tipado

- TypeScript en modo **strict**.
- Interfaces para props de componentes:

```typescript
interface MembersTableProps {
  members: Member[]
  onDelete?: (id: string) => void
}
```

- Tipos para datos de dominio (cuando se creen):

```typescript
type MembershipType = 'premium' | 'standard' | 'basic'
type MemberStatus = 'active' | 'suspended' | 'inactive'
```

- No usar `any`. Preferir `unknown` + type guards si es necesario.

---

## Nomenclatura

| Qué | Convención | Ejemplo |
|-----|-----------|---------|
| Archivos de componentes | kebab-case | `add-member-dialog.tsx` |
| Componentes React | PascalCase | `AddMemberDialog` |
| Funciones/hooks | camelCase | `useMobile`, `handleSubmit` |
| Variables CSS | kebab-case con `--` | `--primary-foreground` |
| Clases CSS custom | kebab-case | `neon-glow`, `card-cyber` |
| Tablas SQL | snake_case | `revenue_summary` |
| Columnas SQL | snake_case | `membership_type` |

---

## Checklist para nuevas pantallas

1. Crear `app/{zona}/{ruta}/page.tsx`.
2. Crear componentes en `components/{dominio}/` (header, tabla/grid, diálogos).
3. Usar el layout existente (`dashboard/layout.tsx` o `admin/layout.tsx`).
4. Seguir el patrón de navegación con pestañas horizontales.
5. Aplicar tokens del tema (no colores hardcodeados).
6. Texto visible en `uppercase tracking-wider` para labels y títulos pequeños.
7. Valores numéricos en `font-mono`.
8. Actualizar `screens-and-components.md` en `memory-bank/` con la nueva pantalla.

## Checklist para nuevos componentes

1. Archivo en la carpeta de dominio correcta.
2. Nombre en kebab-case, componente en PascalCase.
3. Props tipadas con interface.
4. Usar `cn()` para clases condicionales.
5. Import con alias `@/`.

## Checklist para nuevas tablas SQL

1. Script numerado en `scripts/` (siguiente número disponible).
2. Patrón: `SERIAL PK`, `created_at`/`updated_at` con defaults.
3. FK con `ON DELETE CASCADE` (o `SET NULL` si aplica).
4. Índices en columnas de búsqueda frecuente.
5. Actualizar `data-model.md` en `memory-bank/`.
