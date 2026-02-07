# Sistema de Diseño — RisesSystem

## Tema: "Neon Rise" (Cyber-Industrial)

### Filosofía
Estética oscura, industrial y moderna con acentos de verde lima neón. Inspirado en interfaces cyberpunk con tipografía técnica y efectos de glow.

---

## Modo de color
- **Dark por defecto.** La clase `dark` está fijada en `<html>` en `app/layout.tsx`.
- `ThemeProvider` de `next-themes` existe en `components/theme-provider.tsx` pero **no está integrado** en el layout raíz actualmente. Cuando se integre, permitirá cambio dinámico dark/light.

## Fuentes

| Uso | Fuente | Variable CSS | Clase Tailwind |
|-----|--------|-------------|----------------|
| Texto general | Inter | `--font-inter` | `font-sans` |
| Monospace / datos numéricos | JetBrains Mono | `--font-mono` | `font-mono` |

Definidas en `app/layout.tsx` con `next/font/google`.

## Paleta de colores

Todas las variables están en `app/globals.css` usando formato HSL (sin `hsl()`, solo los valores).

### Colores principales

| Token | Variable CSS | Valor HSL | Uso |
|-------|-------------|-----------|-----|
| Primary | `--primary` | `84 81% 65%` | Verde lima neón (#a3e635). Acciones, acentos, links. |
| Primary Foreground | `--primary-foreground` | `0 0% 0%` | Texto sobre primary (negro). |
| Background | `--background` | `240 10% 3.6%` | Fondo principal (casi negro). |
| Foreground | `--foreground` | `0 0% 98%` | Texto principal (blanco). |
| Card | `--card` | `240 10% 7.8%` | Fondo de cards (zinc oscuro). |
| Secondary | `--secondary` | `240 10% 15%` | Superficies secundarias. |
| Muted | `--muted` | `240 10% 18%` | Superficies muted. |
| Muted Foreground | `--muted-foreground` | `0 0% 63%` | Texto secundario/descriptivo. |
| Border | `--border` | `240 10% 13%` | Bordes sutiles. |

### Colores semánticos

| Token | Variable CSS | Valor HSL | Uso |
|-------|-------------|-----------|-----|
| Destructive | `--destructive` | `354 96% 56%` | Errores, acciones peligrosas (rojo). |
| Success | `--success` | `160 84% 39%` | Éxito, positivo (esmeralda). |
| Warning | `--warning` | `45 93% 56%` | Advertencia (ámbar). |

### Colores de gráficos

| Token | Variable | Color |
|-------|---------|-------|
| Chart 1 | `--chart-1` | Verde lima (primary) |
| Chart 2 | `--chart-2` | Esmeralda (success) |
| Chart 3 | `--chart-3` | Rojo (destructive) |
| Chart 4 | `--chart-4` | Ámbar (warning) |
| Chart 5 | `--chart-5` | Azul |

## Border radius
- Variable: `--radius: 0.5rem`
- Tailwind: `rounded-lg` (0.5rem), `rounded-md` (calc - 2px), `rounded-sm` (calc - 4px).

---

## Clases de utilidad del tema

Definidas en `app/globals.css` dentro de `@layer components`:

| Clase | Efecto |
|-------|--------|
| `neon-glow` | Sombra verde lima grande: `shadow-[0_0_20px_rgba(163,230,53,0.3)]` |
| `neon-glow-sm` | Sombra verde lima pequeña: `shadow-[0_0_10px_rgba(163,230,53,0.2)]` |
| `neon-border` | Borde con glow interior primario |
| `neon-border-active` | Borde activo con glow fuerte |
| `text-neon` | Texto primary + bold + tracking-wider |
| `card-cyber` | Card oscura con borde sutil, hover con glow verde |
| `card-cyber-active` | Card con borde primary y glow más intenso |

---

## Patrones de UI

### Headers de sección
- Logo (cuadrado redondeado con fondo `bg-primary`, texto `text-primary-foreground`).
- Título en mayúsculas, `tracking-wider`.
- Subtítulo en `text-muted-foreground`, `uppercase`, `text-xs`, `tracking-widest`.

### Navegación
- Pestañas horizontales con `border-b-2`.
- Activa: `bg-secondary`, `border-primary`, `text-foreground` (o `text-primary`).
- Inactiva: `border-transparent`, `text-muted-foreground`.
- Texto: `uppercase`, `tracking-wider`, `text-xs`, `font-semibold`.

### Cards (KPIs y contenido)
- `border border-border/50` con `hover:border-primary/30` y `hover:shadow-lg`.
- Valores numéricos en `font-mono` y `text-3xl font-bold`.
- Labels en `uppercase tracking-wider text-sm text-muted-foreground`.

### Diálogos
- shadcn `Dialog` con `bg-card border-border`.
- Formularios con `Label` + `Input`/`Select`, espaciado `space-y-4`.
- Botones de acción al final: primary para confirmar, outline/ghost para cancelar.

### Botones
- Variantes definidas con CVA en `components/ui/button.tsx`.
- Default: `bg-primary`, hover con glow.
- Texto: `uppercase tracking-wider font-semibold`.
- Tamaños: default (h-10), sm (h-9), lg (h-11), icon (h-10 w-10).

### Inputs
- Borde `border-border/50`.
- Focus: `border-primary` con sombra `shadow-[0_0_12px_rgba(163,230,53,0.2)]`.

---

## Regla de oro
**Nunca usar colores hardcodeados.** Siempre usar tokens semánticos de Tailwind (`bg-background`, `text-primary`, `border-border`, etc.) o las variables CSS del tema. Esto permite que el tema se mantenga consistente y se pueda cambiar centralmente.
