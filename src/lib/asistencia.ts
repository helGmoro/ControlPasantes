import { format } from "date-fns";
import type { Asistencia, DiaAsistencia, EstadoAsistencia } from "./types";

export const ESTADOS: { value: EstadoAsistencia; label: string }[] = [
  { value: "presente", label: "Presente" },
  { value: "tarde", label: "Tarde" },
  { value: "ausente", label: "Ausente" },
  { value: "justificado", label: "Justificado" },
];

export function etiquetaEstado(estado: EstadoAsistencia): string {
  return ESTADOS.find((e) => e.value === estado)?.label ?? estado;
}

// Horas trabajadas: "ausente" siempre es 0. El resto se calcula a partir
// de entrada/salida, que el tutor carga manualmente sin relación con el estado.
export function calcularHoras(
  estado: EstadoAsistencia,
  horaEntrada: string | null,
  horaSalida: string | null
): number {
  if (estado === "ausente") return 0;
  if (!horaEntrada || !horaSalida) return 0;

  const [eh, em] = horaEntrada.split(":").map(Number);
  const [sh, sm] = horaSalida.split(":").map(Number);
  const minutos = sh * 60 + sm - (eh * 60 + em);

  return minutos > 0 ? Math.round((minutos / 60) * 100) / 100 : 0;
}

export function sumarHoras(dias: DiaAsistencia[]): number {
  const total = dias.reduce(
    (acc, d) => acc + calcularHoras(d.estado, d.hora_entrada, d.hora_salida),
    0
  );
  return Math.round(total * 100) / 100;
}

// Combina los registros reales de un pasante con un default "ausente"
// para cualquier día del rango que no tenga carga (fin de semana, feriado
// u olvido). El tutor puede editar cualquiera de esos días después.
export function generarDiasConDefault(
  desde: Date,
  hasta: Date,
  registros: Asistencia[],
  pasanteId: string
): DiaAsistencia[] {
  const porFecha = new Map(registros.map((r) => [r.fecha, r]));
  const dias: DiaAsistencia[] = [];
  const cursor = new Date(desde);

  while (cursor <= hasta) {
    const fechaStr = format(cursor, "yyyy-MM-dd");
    const registro = porFecha.get(fechaStr);

    if (registro) {
      dias.push({ ...registro, esVirtual: false });
    } else {
      dias.push({
        id: `virtual-${pasanteId}-${fechaStr}`,
        pasante_id: pasanteId,
        fecha: fechaStr,
        hora_entrada: null,
        hora_salida: null,
        estado: "ausente",
        observaciones: null,
        esVirtual: true,
      });
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return dias;
}
