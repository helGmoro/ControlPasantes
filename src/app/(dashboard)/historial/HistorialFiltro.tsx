"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ pasanteId, desde, hasta });

  function aplicar() {
    const params = new URLSearchParams({
      pasante: form.pasanteId,
      desde: form.desde,
      hasta: form.hasta,
    });
    startTransition(() => {
      router.push(`/historial?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="w-full sm:w-auto">
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Pasante
        </label>
        <select
          value={form.pasanteId}
          onChange={(e) => setForm({ ...form, pasanteId: e.target.value })}
          disabled={isPending}
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 sm:w-auto"
        >
          <option value="">Seleccionar...</option>
          {pasantes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.apellido}, {p.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full sm:w-auto">
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Desde
        </label>
        <input
          type="date"
          value={form.desde}
          onChange={(e) => setForm({ ...form, desde: e.target.value })}
          disabled={isPending}
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 sm:w-auto"
        />
      </div>
      <div className="w-full sm:w-auto">
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Hasta
        </label>
        <input
          type="date"
          value={form.hasta}
          onChange={(e) => setForm({ ...form, hasta: e.target.value })}
          disabled={isPending}
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 sm:w-auto"
        />
      </div>
      <button
        onClick={aplicar}
        disabled={isPending}
        className="w-full rounded-md bg-gradient-to-br from-blue-500 to-blue-700 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-transform hover:brightness-110 active:scale-[0.98] disabled:opacity-50 sm:w-auto"
      >
        {isPending ? "Cargando..." : "Filtrar"}
      </button>
    </div>
  );
}
