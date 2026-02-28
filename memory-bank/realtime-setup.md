# Realtime (Supabase) — Configuración

## Habilitar Realtime en una tabla

En **Supabase Dashboard → Database → Replication**: activa la replicación para la tabla `check_ins` para que los eventos INSERT (y opcionalmente UPDATE/DELETE) se emitan por Realtime.

## Uso en la app

- **Check-ins en vivo**: la página **QR Scanner** (`/dashboard/qr-scanner`) usa el hook `useRealtimeCheckIns`, que se suscribe a `postgres_changes` en la tabla `check_ins`. Al escanear un QR se llama a `createCheckIn(member_id)`; el INSERT se refleja en tiempo real en todos los clientes abiertos.
- **Hook**: `hooks/use-realtime-check-ins.ts` — obtiene datos iniciales con `getCheckIns()` y se suscribe a `check_ins` con el cliente de Supabase en el navegador.

## Chat (messages)

Si más adelante añades una tabla `messages` y una UI de chat, el mismo patrón sirve: habilitar Realtime en `messages` y suscribirse a `postgres_changes` (INSERT) para actualizar la lista de mensajes en vivo.
