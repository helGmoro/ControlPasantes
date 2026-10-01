"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { EstadoAsistencia } from "@/lib/types";

export async function guardarAsistencia(input: {
  pasanteId: string;
  fecha: string;
  estado: EstadoAsistencia;
  horaEntrada: string | null;
  horaSalida: string | null;
  observaciones: string | null;
}) {
  const supabase = await createClient();

  // Si el estado es "ausente" se fuerzan las horas a null (0 hs trabajadas),
  // independientemente de lo que haya en los inputs.
  const esAusente = input.estado === "ausente";

  const { error } = await supabase.from("asistencias").upsert(
    {
      pasante_id: input.pasanteId,
      fecha: input.fecha,
      estado: input.estado,
      hora_entrada: esAusente ? null : input.horaEntrada,
      hora_salida: esAusente ? null : input.horaSalida,
      observaciones: input.observaciones,
    },
    { onConflict: "pasante_id,fecha" }
  );

  if (error) throw new Error(error.message);

  revalidatePath("/asistencia");
  revalidatePath("/historial");
  revalidatePath("/planilla");
}
