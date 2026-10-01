"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Asistencia, EstadoAsistencia, Pasante } from "@/lib/types";
import { calcularHoras, ESTADOS } from "@/lib/asistencia";
import { guardarAsistencia } from "./actions";

interface Fila {
  pasante: Pasante;
  estado: EstadoAsistencia;
  horaEntrada: string;
  horaSalida: string;
  observaciones: string;
  guardando: boolean;
  guardado: boolean;
}

function filaInicial(pasante: Pasante, registro?: Asistencia): Fila {
  return {
    pasante,
    estado: registro?.estado ?? "presente",
    horaEntrada: registro?.hora_entrada?.slice(0, 5) ?? "",
    horaSalida: registro?.hora_salida?.slice(0, 5) ?? "",
    observaciones: registro?.observaciones ?? "",
    guardando: false,
    guardado: false,
  };
}

export default function AsistenciaTable({
  fecha,
  pasantes,
  registros,
}: {
  fecha: string;
  pasantes: Pasante[];
  registros: Asistencia[];
}) {
  const router = useRouter();
  const porPasante = new Map(registros.map((r) => [r.pasante_id, r]));

  const [filas, setFilas] = useState<Fila[]>(() =>
    pasantes.map((p) => filaInicial(p, porPasante.get(p.id)))
  );

  function actualizarFila(index: number, cambios: Partial<Fila>) {
    setFilas((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, ...cambios, guardado: false } : f
      )
    );
  }

  function cambiarFecha(nuevaFecha: string) {
    router.push(`/asistencia?fecha=${nuevaFecha}`);
  }

  async function guardarFila(index: number) {
    const fila = filas[index];
    actualizarFila(index, { guardando: true });

    try {
      await guardarAsistencia({
        pasanteId: fila.pasante.id,
        fecha,
        estado: fila.estado,
        horaEntrada: fila.horaEntrada || null,
        horaSalida: fila.horaSalida || null,
        observaciones: fila.observaciones || null,
      });
      actualizarFila(index, { guardando: false, guardado: true });
    } catch {
      actualizarFila(index, { guardando: false });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">
          Asistencia diaria
        </h1>
        <input
          type="date"
          value={fecha}
          onChange={(e) => cambiarFecha(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
            <tr>
              <th className="px-4 py-2">Pasante</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Entrada</th>
              <th className="px-4 py-2">Salida</th>
              <th className="px-4 py-2">Horas</th>
              <th className="px-4 py-2">Observaciones</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, i) => {
              const esAusente = fila.estado === "ausente";
              const horas = calcularHoras(
                fila.estado,
                fila.horaEntrada || null,
                fila.horaSalida || null
              );

              return (
                <tr key={fila.pasante.id} className="border-t border-gray-100">
                  <td className="px-4 py-2">
                    {fila.pasante.apellido}, {fila.pasante.nombre}
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={fila.estado}
                      onChange={(e) =>
                        actualizarFila(i, {
                          estado: e.target.value as EstadoAsistencia,
                        })
                      }
                      className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                    >
                      {ESTADOS.map((e) => (
                        <option key={e.value} value={e.value}>
                          {e.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="time"
                      value={fila.horaEntrada}
                      disabled={esAusente}
                      onChange={(e) =>
                        actualizarFila(i, { horaEntrada: e.target.value })
                      }
                      className="rounded-md border border-gray-300 px-2 py-1 text-sm disabled:bg-gray-100"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="time"
                      value={fila.horaSalida}
                      disabled={esAusente}
                      onChange={(e) =>
                        actualizarFila(i, { horaSalida: e.target.value })
                      }
                      className="rounded-md border border-gray-300 px-2 py-1 text-sm disabled:bg-gray-100"
                    />
                  </td>
                  <td className="px-4 py-2 text-gray-600">{horas} hs</td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={fila.observaciones}
                      onChange={(e) =>
                        actualizarFila(i, { observaciones: e.target.value })
                      }
                      placeholder="Opcional"
                      className="w-40 rounded-md border border-gray-300 px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => guardarFila(i)}
                      disabled={fila.guardando}
                      className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {fila.guardando
                        ? "Guardando..."
                        : fila.guardado
                        ? "Guardado ✓"
                        : "Guardar"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {filas.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  No hay pasantes activos cargados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
