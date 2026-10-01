"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Pasante } from "@/lib/types";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function PlanillaFiltro({
  pasantes,
  pasanteId,
  anio,
  mes,
}: {
  pasantes: Pasante[];
  pasanteId: string;
  anio: number;
  mes: number; // 1-12
}) {
  const router = useRouter();
  const [form, setForm] = useState({ pasanteId, anio, mes });

  function aplicar() {
    const params = new URLSearchParams({
      pasante: form.pasanteId,
      anio: String(form.anio),
      mes: String(form.mes),
    });
    router.push(`/planilla?${params.toString()}`);
  }

  const anioActual = new Date().getFullYear();
  const anios = [anioActual - 1, anioActual, anioActual + 1];

  return (
    <div className="no-print flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Pasante
        </label>
        <select
          value={form.pasanteId}
          onChange={(e) => setForm({ ...form, pasanteId: e.target.value })}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          Mes
        </label>
        <select
          value={form.mes}
          onChange={(e) => setForm({ ...form, mes: Number(e.target.value) })}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {MESES.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Año
        </label>
        <select
          value={form.anio}
          onChange={(e) => setForm({ ...form, anio: Number(e.target.value) })}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {anios.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={aplicar}
        className="rounded-md bg-gradient-to-br from-blue-500 to-blue-700 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-transform hover:brightness-110 active:scale-[0.98]"
      >
        Generar
      </button>
      {pasanteId && (
        <button
          onClick={() => window.print()}
          className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Imprimir
        </button>
      )}
    </div>
  );
}
