"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function crearPasante(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("pasantes").insert({
    nombre: String(formData.get("nombre") ?? "").trim(),
    apellido: String(formData.get("apellido") ?? "").trim(),
    legajo: String(formData.get("legajo") ?? "").trim() || null,
    area: String(formData.get("area") ?? "").trim() || null,
    fecha_inicio: String(formData.get("fecha_inicio") ?? ""),
    fecha_fin: String(formData.get("fecha_fin") ?? "") || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/pasantes");
}

export async function actualizarPasante(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("pasantes")
    .update({
      nombre: String(formData.get("nombre") ?? "").trim(),
      apellido: String(formData.get("apellido") ?? "").trim(),
      legajo: String(formData.get("legajo") ?? "").trim() || null,
      area: String(formData.get("area") ?? "").trim() || null,
      fecha_inicio: String(formData.get("fecha_inicio") ?? ""),
      fecha_fin: String(formData.get("fecha_fin") ?? "") || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/pasantes");
}

export async function cambiarActivo(id: string, activo: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("pasantes")
    .update({ activo })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/pasantes");
}
