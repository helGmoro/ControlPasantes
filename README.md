# Control de asistencia de pasantes

App web interna para que los tutores de una organización controlen la
asistencia de sus pasantes, sin usar planillas de Excel sueltas. Cada tutor
inicia sesión con usuario y contraseña y ve únicamente sus propios pasantes;
nadie ve los datos de otro tutor salvo los admins.

## Qué hace la app

- **Pasantes** (`/pasantes`): alta, edición y baja de los pasantes a cargo de
  un tutor (nombre, legajo, área, fecha de inicio/fin, activo o no).
- **Asistencia diaria** (`/asistencia`): para una fecha dada, el tutor carga
  por cada pasante el estado del día — **presente**, **tarde**, **ausente**
  o **justificado** —, la hora de entrada/salida y observaciones.
- **Historial** (`/historial`): filtra la asistencia de un pasante en un
  rango de fechas. Los días sin carga se muestran como "ausente" por
  defecto (no hace falta cargar manualmente los días en que el pasante no
  vino), y el tutor puede editarlos desde ahí.
- **Horas trabajadas**: se calculan automáticamente a partir de la hora de
  entrada y salida de cada día (un "ausente" siempre son 0 horas).
- **Planilla mensual** (`/planilla`): resumen de asistencia y horas de un
  mes, pensado para imprimirse en A4 (por ejemplo, para firmar o archivar en
  papel).
- **Administración** (`/admin`, solo para cuentas con rol admin): alta de
  nuevas cuentas de tutor (o de otro admin) sin necesidad de tocar la
  terminal ni la base de datos directamente.



Stack: Next.js (React) + Supabase (Auth + Postgres) + Vercel.

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
 
-
```