import { endOfMonth, format, startOfMonth } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import type { Asistencia, Pasante } from "@/lib/types";
import { calcularHoras, etiquetaEstado, generarDiasConDefault, sumarHoras } from "@/lib/asistencia";
import PlanillaFiltro from "./PlanillaFiltro";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default async function PlanillaPage({
  searchParams,
}: {
  searchParams: Promise<{ pasante?: string; anio?: string; mes?: string }>;
}) {
  const params = await searchParams;
  const hoy = new Date();
  const pasanteId = params.pasante ?? "";
  const anio = Number(params.anio ?? hoy.getFullYear());
  const mes = Number(params.mes ?? hoy.getMonth() + 1);

  const primerDiaMes = startOfMonth(new Date(anio, mes - 1, 1));
  const ultimoDiaMes = endOfMonth(primerDiaMes);
  const hasta = ultimoDiaMes < hoy ? ultimoDiaMes : hoy;

  const supabase = await createClient();

  const { data: pasantes } = await supabase
    .from("pasantes")
    .select("*")
    .order("apellido", { ascending: true });

  const pasanteSeleccionado = (pasantes ?? []).find((p) => p.id === pasanteId) as
    | Pasante
    | undefined;

  let dias: ReturnType<typeof generarDiasConDefault> = [];
  if (pasanteId && primerDiaMes <= hasta) {
    const { data } = await supabase
      .from("asistencias")
      .select("*")
      .eq("pasante_id", pasanteId)
      .gte("fecha", format(primerDiaMes, "yyyy-MM-dd"))
      .lte("fecha", format(hasta, "yyyy-MM-dd"))
      .order("fecha", { ascending: true });

    dias = generarDiasConDefault(primerDiaMes, hasta, (data ?? []) as Asistencia[], pasanteId);
  }

  const totalHoras = sumarHoras(dias);

  return (
    <div className="space-y-4">
      <h1 className="no-print text-lg font-semibold text-gray-900">
        Planilla mensual
      </h1>

      <PlanillaFiltro
        pasantes={(pasantes ?? []) as Pasante[]}
        pasanteId={pasanteId}
        anio={anio}
        mes={mes}
      />

      {pasanteSeleccionado && (
        <div className="planilla rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Planilla de asistencia
              </h2>
              <p className="text-sm text-gray-600">
                {pasanteSeleccionado.apellido}, {pasanteSeleccionado.nombre}
                {pasanteSeleccionado.area ? ` — ${pasanteSeleccionado.area}` : ""}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              {MESES[mes - 1]} {anio}
            </p>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left text-xs uppercase text-gray-500">
                <th className="py-1.5">Fecha</th>
                <th className="py-1.5">Estado</th>
                <th className="py-1.5">Entrada</th>
                <th className="py-1.5">Salida</th>
                <th className="py-1.5">Horas</th>
                <th className="py-1.5">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {dias.map((d) => (
                <tr key={d.id} className="border-b border-gray-100">
                  <td className="py-1">{d.fecha}</td>
                  <td className="py-1">{etiquetaEstado(d.estado)}</td>
                  <td className="py-1">{d.hora_entrada ?? "-"}</td>
                  <td className="py-1">{d.hora_salida ?? "-"}</td>
                  <td className="py-1">
                    {calcularHoras(d.estado, d.hora_entrada, d.hora_salida)}
                  </td>
                  <td className="py-1">{d.observaciones ?? ""}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="pt-3 text-right text-sm font-medium">
                  Total de horas:
                </td>
                <td colSpan={2} className="pt-3 text-sm font-semibold">
                  {totalHoras} hs
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="mt-10 flex justify-between text-sm text-gray-600">
            <div className="border-t border-gray-400 pt-1 pr-16">
              Firma del tutor
            </div>
            <div className="border-t border-gray-400 pt-1 pl-16">
              Firma del pasante
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
