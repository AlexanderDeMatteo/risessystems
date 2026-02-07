# Subir a GitHub

El proyecto ya tiene Git inicializado y el primer commit hecho. Solo falta crear el repo en GitHub y hacer push.

## Pasos

1. **Crea el repositorio en GitHub**
   - Entra en [github.com/new](https://github.com/new)
   - **Repository name:** `risessistem` (o el nombre que quieras)
   - Elige **Public**
   - **No** marques "Add a README" ni ".gitignore" (ya los tienes en el proyecto)
   - Pulsa **Create repository**

2. **Conecta y sube** (copia y pega en la terminal, sustituye `TU_USUARIO` por tu usuario de GitHub):

   ```bash
   cd "c:\Users\aldml\OneDrive\Escritorio\risessistem"
   git remote add origin https://github.com/TU_USUARIO/risessistem.git
   git branch -M main
   git push -u origin main
   ```

   Si GitHub te pide autenticación, usa tu usuario y un **Personal Access Token** como contraseña (no la contraseña de la cuenta). Crear token: GitHub → Settings → Developer settings → Personal access tokens.

Listo. Después puedes conectar este repo en Vercel para desplegar.
