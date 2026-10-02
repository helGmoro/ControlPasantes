"use client";

import { Fragment, useState } from "react";
import type { Pasante } from "@/lib/types";
import { cambiarActivo } from "./actions";
import PasanteForm from "./PasanteForm";
import { toast } from "@/lib/toast";

export default function PasantesTable({
  pasantes,
}: {
  pasantes: Pasante[];
}) {
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [cambiandoId, setCambiandoId] = useState<string | null>(null);

  async function handleCambiarActivo(
    id: string,
    activo: boolean,
    nombreCompleto: string
  ) {
    if (!activo) {
      const confirmar = window.confirm(
        `¿Seguro que querés desactivar a ${nombreCompleto}? Dejará de aparecer en la carga de asistencia diaria.`
      );
      if (!confirmar) return;
    }

    setCambiandoId(id);
    try {
      await cambiarActivo(id, activo);
      toast.success(activo ? "Pasante activado" : "Pasante desactivado");
    } catch {
      toast.error("No se pudo actualizar el pasante. Intentá nuevamente.");
    } finally {
      setCambiandoId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          Pasantes
        </h1>
        {!mostrarNuevo && (
          <button
            onClick={() => setMostrarNuevo(true)}
            className="rounded-md bg-gradient-to-br from-blue-500 to-blue-700 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-transform hover:brightness-110 active:scale-[0.98]"
          >
            + Nuevo pasante
          </button>
        )}
      </div>

      {mostrarNuevo && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <PasanteForm onDone={() => setMostrarNuevo(false)} />
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Área</th>
              <th className="px-4 py-2">Inicio</th>
              <th className="px-4 py-2">Fin</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {pasantes.map((p) => (
              <Fragment key={p.id}>
                <tr className="border-t border-gray-100 transition-colors hover:bg-blue-50/40">
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {p.apellido}, {p.nombre}
                    {p.legajo && (
                      <span className="ml-1 text-gray-600">({p.legajo})</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-800">{p.area ?? "-"}</td>
                  <td className="px-4 py-2 text-gray-800">{p.fecha_inicio}</td>
                  <td className="px-4 py-2 text-gray-800">
                    {p.fecha_fin ?? "-"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.activo
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {p.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="space-x-3 px-4 py-2 text-right">
                    <button
                      onClick={() =>
                        setEditandoId(editandoId === p.id ? null : p.id)
                      }
                      disabled={cambiandoId === p.id}
                      className="text-gray-600 transition-colors hover:text-gray-900 disabled:opacity-50"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        handleCambiarActivo(
                          p.id,
                          !p.activo,
                          `${p.nombre} ${p.apellido}`
                        )
                      }
                      disabled={cambiandoId === p.id}
                      className={`disabled:opacity-50 ${
                        p.activo
                          ? "text-red-600 transition-colors hover:text-red-700"
                          : "text-blue-600 transition-colors hover:text-blue-700"
                      }`}
                    >
                      {cambiandoId === p.id
                        ? "..."
                        : p.activo
                        ? "Desactivar"
                        : "Activar"}
                    </button>
                  </td>
                </tr>
                {editandoId === p.id && (
                  <tr className="border-t border-gray-100 bg-gray-50">
                    <td colSpan={6} className="px-4 py-3">
                      <PasanteForm
                        pasante={p}
                        onDone={() => setEditandoId(null)}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {pasantes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Todavía no cargaste ningún pasante.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
