# Sign in with Google (OAuth) — Planificación

## Estado
Implementado (Fase 3 extra). Botón en login y register; `ensureUserProfile` en layout del dashboard crea fila en `public.users` si falta (OAuth o email confirmado).

## Qué necesitas tú (configuración)

1. **Google Cloud Console**
   - Entra en [Google Cloud Console](https://console.cloud.google.com/).
   - Crea un proyecto o elige uno existente.
   - **APIs & Services → Credentials** → **Create Credentials** → **OAuth client ID**.
   - Tipo: **Web application**.
   - En **Authorized redirect URIs** añade la URL que te da Supabase (en el panel de Google de Supabase suele aparecer; si no, es de la forma `https://<PROJECT_REF>.supabase.co/auth/v1/callback`).

2. **Supabase Dashboard**
   - **Authentication → Sign In / Providers → Google**.
   - Activa **Enable Sign in with Google**.
   - Pega el **Client ID** y el **Client Secret** que obtuviste en Google Cloud.
   - Guarda (Save).

3. **URL Configuration (Supabase)**
   - **Authentication → URL Configuration**.
   - **Site URL**: tu dominio en producción (o `http://localhost:3000` en desarrollo).
   - **Redirect URLs**: añade `http://localhost:3000/auth/callback` (y en producción tu dominio + `/auth/callback`). Opcional: `http://localhost:3000/**` para permitir otras rutas.

## Qué haremos en código

- **Login y Register**: botón "Continuar con Google" que llama a `signInWithOAuth` con `redirectTo: ${origin}/auth/callback`.
- **Callback (`app/auth/callback/route.ts`)**: ruta obligatoria para OAuth con PKCE. Supabase redirige aquí con `?code=...`; la ruta intercambia el código por sesión (JWT + refresh token), escribe las cookies en la respuesta y redirige a `/dashboard`. Así el JWT queda guardado en cookies y el middleware reconoce al usuario.
- **Middleware**: usa `getUser()` (no solo `getClaims()`) para validar la sesión con el servidor de Supabase.
- **Perfil en `public.users`**: al entrar por primera vez con Google no tendremos `name` ni `gym_name` del formulario. Opciones:
  - **A)** Crear fila con email + nombre de Google (`user_metadata.full_name` o `user_metadata.name`) y `gym_name` en NULL; luego el usuario puede completar en Profile/Settings.
  - **B)** Tras el primer login con Google redirigir a una pantalla "Completa tu perfil" (nombre del gimnasio, etc.) y luego crear la fila en `public.users`.

Recomendación: **A)** para menos fricción; el "asegurar perfil" (ensureUserProfile) que usaremos con confirmación de email puede reutilizarse aquí: si no existe fila para `auth.uid()`, insertar con `email` + `raw_user_meta_data.full_name` (o `name`) y `gym_name` NULL.

## Orden sugerido

1. Tú configuras Google Cloud + Supabase (Client ID, Secret, redirect URI).
2. Implementamos: botón Google en login (y opcional en register), ensureUserProfile en primer acceso al dashboard para usuarios OAuth (crear fila en `public.users` con datos de Google).
