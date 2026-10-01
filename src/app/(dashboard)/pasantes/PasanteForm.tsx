"use client";

import { useState } from "react";
import type { Pasante } from "@/lib/types";
import { crearPasante, actualizarPasante } from "./actions";

export default function PasanteForm({
  pasante,
  onDone,
}: {
  pasante?: Pasante;
  onDone?: () => void;
}) {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setGuardando(true);
    setError(null);
    try {
      if (pasante) {
        await actualizarPasante(pasante.id, formData);
      } else {
        await crearPasante(formData);
      }
      onDone?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form action={handleSubmit} className="grid grid-cols-2 gap-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          name="nombre"
          defaultValue={pasante?.nombre}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Apellido
        </label>
        <input
          name="apellido"
          defaultValue={pasante?.apellido}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Legajo (opcional)
        </label>
        <input
          name="legajo"
          defaultValue={pasante?.legajo ?? ""}
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Área (opcional)
        </label>
        <input
          name="area"
          defaultValue={pasante?.area ?? ""}
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Fecha de inicio
        </label>
        <input
          type="date"
          name="fecha_inicio"
          defaultValue={pasante?.fecha_inicio}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Fecha de fin (opcional)
        </label>
        <input
          type="date"
          name="fecha_fin"
          defaultValue={pasante?.fecha_fin ?? ""}
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}

      <div className="col-span-2 flex justify-end gap-2 pt-1">
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={guardando}
          className="rounded-md bg-gradient-to-br from-blue-500 to-blue-700 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-transform hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
