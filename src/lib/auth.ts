// Supabase Auth necesita un email internamente, pero el tutor solo ve
// usuario + contraseña. Mapeamos el username a un email sintético que
// nunca se muestra ni se usa para enviar correos reales.
const DOMINIO_INTERNO = "tutores.local";

export function usernameToEmail(username: string): string {
  return `${username.trim().toLowerCase()}@${DOMINIO_INTERNO}`;
}
