# Pendientes para producción — RisesSystem

## Flujo de invitación de clientes: magic link vs contraseña

**Estado actual (desarrollo):** El admin crea clientes asignando una contraseña provisional. No se usa SMTP/email. El dueño del gym puede cambiar su contraseña en Perfil → Cambiar contraseña.

**Al lanzar la app (con dominio y SMTP):**

- Configurar SMTP en Supabase (Resend, Gmail u otro) con el dominio verificado.
- El código de **magic link** ya existe y está listo:
  - `inviteClient` en `app/actions/admin.ts` (usa `inviteUserByEmail`)
  - Ruta `/auth/invite` en `app/auth/invite/page.tsx`
- Opciones para el lanzamiento:
  1. Cambiar `AddClientDialog` para llamar a `inviteClient` en lugar de `createClientWithPassword`, o
  2. Añadir un toggle/selector en el diálogo para elegir entre "Enviar invitación por email" (magic link) y "Asignar contraseña manual".

---

## Referencias en el código

| Flujo | Archivo | Función / ruta |
|-------|---------|----------------|
| Crear con contraseña | `app/actions/admin.ts` | `createClientWithPassword` |
| Invitar por magic link | `app/actions/admin.ts` | `inviteClient` |
| Landing del magic link | `app/auth/invite/page.tsx` | Página cliente |
| Cambiar contraseña | `app/actions/auth.ts` | `updatePassword` |
