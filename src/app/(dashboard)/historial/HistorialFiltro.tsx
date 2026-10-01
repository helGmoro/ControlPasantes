"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Pasante } from "@/lib/types";

export default function HistorialFiltro({
  pasantes,
  pasanteId,
  desde,
  hasta,
}: {
  pasantes: Pasante[];
  pasanteId: string;
  desde: string;
  hasta: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState({ pasanteId, desde, hasta });

  function aplicar() {
    const params = new URLSearchParams({
      pasante: form.pasanteId,
      desde: form.desde,
      hasta: form.hasta,
    });
    router.push(`/historial?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Pasante
        </label>
        <select
          value={form.pasanteId}
          onChange={(e) => setForm({ ...form, pasanteId: e.target.value })}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="">Seleccionar...</option>
          {pasantes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.apellido}, {p.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Desde
        </label>
        <input
          type="date"
          value={form.desde}
          onChange={(e) => setForm({ ...form, desde: e.target.value })}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Hasta
        </label>
        <input
          type="date"
          value={form.hasta}
          onChange={(e) => setForm({ ...form, hasta: e.target.value })}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        />
      </div>
      <button
        onClick={aplicar}
        className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Filtrar
      </button>
    </div>
  );
}
