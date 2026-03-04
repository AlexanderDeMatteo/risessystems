# Ejecutar todas las migraciones en Supabase

Este documento explica cómo crear todas las tablas y políticas del proyecto en un proyecto de Supabase ejecutando un único script SQL.

## Archivo a usar

- **`scripts/all-migrations.sql`** — Contiene, en orden, todos los scripts de migración (01 → 02 → 03 → 05 → 06 → 07 → 08 → 09 → 10 → 11 → 13 → 12 → 15 → 16 → 14).

## Pasos

### 1. Crear los buckets de Storage (opcional pero recomendado)

Si vas a usar avatares, ejercicios o fotos de progreso:

1. En el **Dashboard de Supabase**, ve a **Storage**.
2. Pulsa **New bucket** y crea estos tres buckets (si no existen):
   - `avatars`
   - `exercises`
   - `progress-photos`

Si no creas los buckets, el script igual se ejecuta; las políticas de Storage se aplicarán cuando los buckets existan.

### 2. Ejecutar el script SQL

1. En el **Dashboard de Supabase**, ve a **SQL Editor**.
2. Pulsa **New query**.
3. Abre el archivo **`scripts/all-migrations.sql`** del proyecto, copia todo su contenido y pégalo en el editor.
4. Pulsa **Run** (o Ctrl+Enter).
5. Comprueba que no haya errores en la pestaña de resultados. Si todo va bien, verás las tablas en **Table Editor**.

### 3. Asignar un usuario como admin (después del primer registro)

No hay admin por defecto. Cuando tengas al menos un usuario en la tabla `users` (por ejemplo, después de registrarte en la app):

1. Ve de nuevo a **SQL Editor** en Supabase.
2. Ejecuta (sustituye el email por el tuyo):

```sql
UPDATE users SET role = 'admin' WHERE email = 'tu@email.com';
```

Solo los usuarios con `role = 'admin'` pueden acceder al panel de administración (`/admin`).

## Resumen

| Paso | Acción |
|------|--------|
| 1 | (Opcional) Crear buckets `avatars`, `exercises`, `progress-photos` en Storage |
| 2 | SQL Editor → pegar `scripts/all-migrations.sql` → Run |
| 3 | Tras tener un usuario en `users`, ejecutar `UPDATE users SET role = 'admin' WHERE email = '...';` |

Si prefieres ejecutar los scripts uno a uno, usa el orden indicado en **`scripts/README.md`**.
