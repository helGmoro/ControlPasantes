import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import type { Asistencia, Pasante } from "@/lib/types";
import AsistenciaTable from "./AsistenciaTable";

export default async function AsistenciaPage({
  searchParams,
}: {
  searchParams: Promise<{ fecha?: string }>;
}) {
  const { fecha: fechaParam } = await searchParams;
  const fecha = fechaParam ?? format(new Date(), "yyyy-MM-dd");

  const supabase = await createClient();

  const [{ data: pasantes, error: errorPasantes }, { data: registros, error: errorRegistros }] =
    await Promise.all([
      supabase
        .from("pasantes")
        .select("*")
        .eq("activo", true)
        .order("apellido", { ascending: true }),
      supabase.from("asistencias").select("*").eq("fecha", fecha),
    ]);

  if (errorPasantes || errorRegistros) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 text-red-600">
        Error al cargar datos: {errorPasantes?.message ?? errorRegistros?.message}
      </div>
    );
  }

  return (
    <AsistenciaTable
      fecha={fecha}
      pasantes={(pasantes ?? []) as Pasante[]}
      registros={(registros ?? []) as Asistencia[]}
    />
  );
}
