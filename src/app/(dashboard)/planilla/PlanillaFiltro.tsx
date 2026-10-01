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
    <div className="no-print flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-4">
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
          Mes
        </label>
        <select
          value={form.mes}
          onChange={(e) => setForm({ ...form, mes: Number(e.target.value) })}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
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
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
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
        className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Generar
      </button>
      {pasanteId && (
        <button
          onClick={() => window.print()}
          className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Imprimir
        </button>
      )}
    </div>
  );
}
