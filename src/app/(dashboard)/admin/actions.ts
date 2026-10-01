"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { usernameToEmail } from "@/lib/auth";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");

  const { data: perfil } = await supabase
    .from("tutores")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (perfil?.rol !== "admin") throw new Error("No autorizado");
}

export async function crearTutor(formData: FormData) {
  await requireAdmin();

  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim() || null;
  const rol = formData.get("rol") === "admin" ? "admin" : "tutor";

  if (!username || !password) {
    throw new Error("Usuario y contraseña son obligatorios");
  }

  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email: usernameToEmail(username),
    password,
    email_confirm: true,
  });

  if (error) throw new Error(error.message);

  const { error: perfilError } = await admin.from("tutores").insert({
    id: data.user.id,
    username,
    nombre,
    rol,
  });

  if (perfilError) throw new Error(perfilError.message);

  revalidatePath("/admin");
}
