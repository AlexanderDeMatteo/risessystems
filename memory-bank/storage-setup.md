# Storage (Supabase) — Configuración

## Buckets

Crear en **Supabase Dashboard → Storage → New bucket**:

- **avatars**: fotos de perfil (trainers, gym owner). Recomendado: **Public** para usar URLs directas en `<img>`.
- **exercises**: imágenes/vídeos de ejercicios. Privado por defecto.
- **progress-photos**: fotos de progreso de miembros. Privado.

## Políticas

Ejecutar **`scripts/14-storage-policies.sql`** en el SQL Editor. Las políticas permiten a cada usuario autenticado leer/escribir solo en su carpeta `{auth.uid()}/` dentro de cada bucket.

## Uso en la app

- **`app/actions/storage.ts`**: Server Actions `uploadAvatar`, `uploadExerciseFile`, `uploadProgressPhoto`, `deleteStorageFile`.
- Ejemplo de subida de avatar desde un formulario:

```tsx
// En un form con input type="file" name="file"
const formData = new FormData()
formData.set('file', file)
const result = await uploadAvatar(formData)
if (result.ok) {
  // result.url es la URL pública (bucket avatars público)
  // Guardar result.url en trainers.avatar_url o users
}
```

- Para buckets privados usar `createSignedUrl` en el cliente cuando necesites mostrar la imagen.
