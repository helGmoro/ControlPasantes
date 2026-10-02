"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addDays, format, parseISO, subDays } from "date-fns";
import { es } from "date-fns/locale";
import type { Asistencia, EstadoAsistencia, Pasante } from "@/lib/types";
import { calcularHoras, ESTADOS } from "@/lib/asistencia";
import { guardarAsistencia } from "./actions";
import { toast } from "@/lib/toast";

interface Fila {
  pasante: Pasante;
  estado: EstadoAsistencia;
  horaEntrada: string;
  horaSalida: string;
  observaciones: string;
}

function filaInicial(pasante: Pasante, registro?: Asistencia): Fila {
  return {
    pasante,
    estado: registro?.estado ?? "presente",
    horaEntrada: registro?.hora_entrada?.slice(0, 5) ?? "",
    horaSalida: registro?.hora_salida?.slice(0, 5) ?? "",
    observaciones: registro?.observaciones ?? "",
  };
}

function formatearFecha(fecha: string): string {
  const texto = format(parseISO(fecha), "EEEE d 'de' MMMM 'de' yyyy", {
    locale: es,
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
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
  const [isPending, startTransition] = useTransition();
  const porPasante = new Map(registros.map((r) => [r.pasante_id, r]));
  const esDiaNuevo = registros.length === 0;

  const [filas, setFilas] = useState<Fila[]>(() =>
    pasantes.map((p) => filaInicial(p, porPasante.get(p.id)))
  );
  const [modo, setModo] = useState<"consulta" | "edicion">(
    esDiaNuevo ? "edicion" : "consulta"
  );
  const [guardandoCambios, setGuardandoCambios] = useState(false);

  useEffect(() => {
    if (modo !== "edicion") return;

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [modo]);

  function actualizarFila(index: number, cambios: Partial<Fila>) {
    setFilas((prev) =>
      prev.map((f, i) => (i === index ? { ...f, ...cambios } : f))
    );
  }

  function irAFecha(nuevaFecha: string) {
    if (modo === "edicion" && !esDiaNuevo) {
      const confirmar = window.confirm(
        "Tenés cambios sin guardar. Si cambiás de fecha se van a descartar. ¿Querés continuar?"
      );
      if (!confirmar) return;
    }
    startTransition(() => {
      router.push(`/asistencia?fecha=${nuevaFecha}`);
    });
  }

  function diaAnterior() {
    irAFecha(format(subDays(parseISO(fecha), 1), "yyyy-MM-dd"));
  }

  function diaSiguiente() {
    irAFecha(format(addDays(parseISO(fecha), 1), "yyyy-MM-dd"));
  }

  function irAHoy() {
    irAFecha(format(new Date(), "yyyy-MM-dd"));
  }

  function handleEditar() {
    setModo("edicion");
  }

  function handleCancelar() {
    setFilas(pasantes.map((p) => filaInicial(p, porPasante.get(p.id))));
    setModo("consulta");
  }

  async function handleGuardarCambios() {
    setGuardandoCambios(true);

    const resultados = await Promise.allSettled(
      filas.map((fila) =>
        guardarAsistencia({
          pasanteId: fila.pasante.id,
          fecha,
          estado: fila.estado,
          horaEntrada: fila.horaEntrada || null,
          horaSalida: fila.horaSalida || null,
          observaciones: fila.observaciones || null,
        })
      )
    );

    setGuardandoCambios(false);

    const fallidos = resultados.filter((r) => r.status === "rejected").length;

    if (fallidos > 0) {
      toast.error(
        fallidos === filas.length
          ? "No se pudieron guardar los cambios"
          : `No se pudieron guardar ${fallidos} de ${filas.length} registros`
      );
      return;
    }

    toast.success(
      esDiaNuevo
        ? "Asistencia guardada correctamente"
        : "Cambios guardados correctamente"
    );
    setModo("consulta");
    router.refresh();
  }

  const bloqueado = modo === "consulta" || isPending;
  const hoy = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold tracking-tight text-gray-900">
        Asistencia diaria
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={diaAnterior}
            disabled={isPending || guardandoCambios}
            aria-label="Día anterior"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            ←
          </button>

          <div className="text-center">
            <p className="font-semibold capitalize text-gray-900">
              {formatearFecha(fecha)}
            </p>
            <div className="mt-0.5 flex items-center justify-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  esDiaNuevo
                    ? "bg-amber-100 text-amber-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {esDiaNuevo ? "Sin registros" : "Con registros"}
              </span>
              {fecha !== hoy && (
                <button
                  type="button"
                  onClick={irAHoy}
                  disabled={isPending || guardandoCambios}
                  className="text-xs text-blue-600 transition-colors hover:text-blue-700 disabled:opacity-50"
                >
                  Ir a hoy
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={diaSiguiente}
            disabled={isPending || guardandoCambios}
            aria-label="Día siguiente"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            →
          </button>
        </div>

        <input
          type="date"
          value={fecha}
          onChange={(e) => irAFecha(e.target.value)}
          disabled={isPending || guardandoCambios}
          aria-label="Elegir fecha específica"
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>

      {isPending && (
        <div className="rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
          Cargando asistencia...
        </div>
      )}

      {!isPending && esDiaNuevo && pasantes.length > 0 && (
        <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-600">
          Sin registros para el {formatearFecha(fecha)}. Completá los datos y
          guardá para crear la asistencia del día.
        </div>
      )}

      {pasantes.length > 0 && (
        <div className="flex justify-end gap-2">
          {modo === "consulta" && (
            <button
              type="button"
              onClick={handleEditar}
              className="rounded-md bg-gradient-to-br from-blue-500 to-blue-700 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-transform hover:brightness-110 active:scale-[0.98]"
            >
              Editar asistencia
            </button>
          )}
          {modo === "edicion" && (
            <>
              {!esDiaNuevo && (
                <button
                  type="button"
                  onClick={handleCancelar}
                  disabled={guardandoCambios}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancelar
                </button>
              )}
              <button
                type="button"
                onClick={handleGuardarCambios}
                disabled={guardandoCambios}
                className="rounded-md bg-gradient-to-br from-blue-500 to-blue-700 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-transform hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
              >
                {guardandoCambios
                  ? "Guardando..."
                  : esDiaNuevo
                  ? "Guardar asistencia"
                  : "Guardar cambios"}
              </button>
            </>
          )}
        </div>
      )}

      <fieldset disabled={bloqueado} className="contents">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-2">Pasante</th>
                  <th className="px-4 py-2">Estado</th>
                  <th className="px-4 py-2">Entrada</th>
                  <th className="px-4 py-2">Salida</th>
                  <th className="px-4 py-2">Horas</th>
                  <th className="px-4 py-2">Observaciones</th>
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
                    <tr
                      key={fila.pasante.id}
                      className="border-t border-gray-100 transition-colors hover:bg-blue-50/40"
                    >
                      <td className="px-4 py-2 font-medium text-gray-900">
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
                          className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
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
                          className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
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
                          className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                        />
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-900">
                        {horas} hs
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={fila.observaciones}
                          onChange={(e) =>
                            actualizarFila(i, {
                              observaciones: e.target.value,
                            })
                          }
                          placeholder="Opcional"
                          className="w-40 rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                        />
                      </td>
                    </tr>
                  );
                })}
                {filas.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No hay pasantes activos cargados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
