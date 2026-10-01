import { format, startOfMonth } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import type { Asistencia, Pasante } from "@/lib/types";
import { calcularHoras, etiquetaEstado, generarDiasConDefault, sumarHoras } from "@/lib/asistencia";
import HistorialFiltro from "./HistorialFiltro";

export default async function HistorialPage({
  searchParams,
}: {
  searchParams: Promise<{ pasante?: string; desde?: string; hasta?: string }>;
}) {
  const params = await searchParams;
  const hoy = new Date();
  const pasanteId = params.pasante ?? "";
  const desde = params.desde ?? format(startOfMonth(hoy), "yyyy-MM-dd");
  const hasta = params.hasta ?? format(hoy, "yyyy-MM-dd");

  const supabase = await createClient();

  const { data: pasantes } = await supabase
    .from("pasantes")
    .select("*")
    .order("apellido", { ascending: true });

  let registros: Asistencia[] = [];
  if (pasanteId) {
    const { data } = await supabase
      .from("asistencias")
      .select("*")
      .eq("pasante_id", pasanteId)
      .gte("fecha", desde)
      .lte("fecha", hasta)
      .order("fecha", { ascending: true });
    registros = (data ?? []) as Asistencia[];
  }

  const dias = pasanteId
    ? generarDiasConDefault(new Date(desde), new Date(hasta), registros, pasanteId)
    : [];

  const totalHoras = sumarHoras(dias);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-900">Historial</h1>

      <HistorialFiltro
        pasantes={(pasantes ?? []) as Pasante[]}
        pasanteId={pasanteId}
        desde={desde}
        hasta={hasta}
      />

      {pasanteId && (
        <>
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
            Total del período: <span className="font-semibold">{totalHoras} hs</span>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-2">Fecha</th>
                  <th className="px-4 py-2">Estado</th>
                  <th className="px-4 py-2">Entrada</th>
                  <th className="px-4 py-2">Salida</th>
                  <th className="px-4 py-2">Horas</th>
                  <th className="px-4 py-2">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {dias.map((d) => (
                  <tr key={d.id} className="border-t border-gray-100">
                    <td className="px-4 py-2">{d.fecha}</td>
                    <td className="px-4 py-2">
                      {etiquetaEstado(d.estado)}
                      {d.esVirtual && (
                        <span className="ml-1 text-xs text-gray-500">
                          (sin cargar)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">{d.hora_entrada ?? "-"}</td>
                    <td className="px-4 py-2">{d.hora_salida ?? "-"}</td>
                    <td className="px-4 py-2">
                      {calcularHoras(d.estado, d.hora_entrada, d.hora_salida)} hs
                    </td>
                    <td className="px-4 py-2">{d.observaciones ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
