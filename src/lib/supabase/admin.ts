import { createClient } from "@supabase/supabase-js";

// Cliente con la service_role key: solo se debe importar desde código de
// servidor (Server Actions o Server Components), NUNCA desde un archivo
// "use client". Se usa exclusivamente para operaciones de administración
// (crear cuentas de tutor) que no pasan por la sesión del usuario.
export function createAdminClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
