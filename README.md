# Control de asistencia de pasantes

App interna para que un tutor registre entrada/salida, estado (presente, tarde,
ausente, justificado) e historial de asistencia de sus pasantes, con cálculo de
horas y una planilla mensual imprimible en A4.

Stack: Next.js (React) + Supabase (Auth + Postgres) + Vercel.

## 1. Crear el proyecto de Supabase

1. Creá un proyecto nuevo en [supabase.com](https://supabase.com) (capa gratuita).
2. En **SQL Editor**, pegá y ejecutá, en orden, el contenido de:
   - [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) — tablas `tutores`, `pasantes`, `asistencias` y políticas de RLS.
   - [`supabase/migrations/0002_rol_admin.sql`](supabase/migrations/0002_rol_admin.sql) — agrega el rol (`admin` / `tutor`) a `tutores`.
3. En **Project Settings > API**, copiá:
   - `Project URL`
   - `anon public key`
   - `service_role key` (solo para uso local, nunca la subas a git ni la pongas en Vercel como variable pública).

## 2. Variables de entorno

Copiá `.env.local.example` a `.env.local` y completá:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## 3. Crear la cuenta admin inicial

No hay pantalla pública de registro. La primera cuenta (un **admin**) se crea a mano
con el script `scripts/create-tutor.mjs`, que usa la `service_role key`:

```bash
node --env-file=.env.local scripts/create-tutor.mjs admin proadmin22 "Administrador" --admin
```

Esa cuenta admin sirve para dos cosas, sin que haga falta crear nada más:

- **Usarla directamente como tutor**: cargar sus propios pasantes y asistencia
  desde `/asistencia`, `/pasantes`, etc. (funciona igual que cualquier tutor).
- **Dar de alta nuevos tutores** desde la sección **Administración** dentro de
  la app (visible solo para cuentas con rol admin), sin volver a tocar la
  terminal. Ahí se puede crear otra cuenta admin o una cuenta tutor normal.

El "usuario" que ve la persona (`admin`, o el que elijas para cada tutor) es
solo eso — Supabase Auth por dentro usa un email sintético
(`usuario@tutores.local`) que nunca se muestra.

Cada tutor (admin o no) ve únicamente sus propios pasantes y asistencias.

## 4. Correr en local

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) — te va a redirigir a `/login`.

## 5. Desplegar en Vercel

1. Subí el repo a GitHub y conectalo en [vercel.com/new](https://vercel.com/new).
2. Cargá las 4 variables en **Project Settings > Environment Variables**:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_URL`
   y `SUPABASE_SERVICE_ROLE_KEY`.
   Estas dos últimas ahora sí hacen falta en Vercel (no solo en local), porque
   la sección **Administración** crea tutores desde un Server Action que corre
   en el servidor de Vercel, no en el navegador — la key nunca llega al cliente.
3. Deploy.

> Nota: el plan gratuito de Supabase pausa el proyecto tras ~7 días sin actividad.
> Si pasa, se reactiva manualmente desde el dashboard de Supabase.

## Estructura

```
src/
├─ app/
│  ├─ login/              -- login con usuario + contraseña
│  ├─ (dashboard)/
│  │  ├─ pasantes/        -- alta, edición y baja de pasantes
│  │  ├─ asistencia/      -- carga diaria de asistencia
│  │  ├─ historial/       -- filtro por pasante y período
│  │  ├─ planilla/        -- planilla mensual imprimible (A4)
│  │  └─ admin/           -- (solo rol admin) alta de nuevos tutores/admins
│  └─ globals.css         -- incluye estilos @media print
├─ components/NavBar.tsx
├─ lib/
│  ├─ supabase/
│  │  ├─ client.ts        -- cliente browser (sesión del usuario)
│  │  ├─ server.ts        -- cliente server (sesión del usuario, cookies)
│  │  └─ admin.ts         -- cliente con service_role key (solo en Server Actions)
│  ├─ auth.ts             -- mapeo username -> email sintético
│  ├─ asistencia.ts       -- cálculo de horas y días con default "ausente"
│  └─ types.ts
├─ proxy.ts                -- protección de rutas (antes "middleware.ts" en Next 16)
supabase/migrations/
├─ 0001_init.sql
└─ 0002_rol_admin.sql
scripts/create-tutor.mjs   -- crea la cuenta admin inicial (usa service_role key)
```
