"use client";

import { useState } from "react";
import { crearTutor } from "./actions";

export default function CrearTutorForm() {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function handleSubmit(formData: FormData) {
    setGuardando(true);
    setError(null);
    setOk(false);
    try {
      await crearTutor(formData);
      setOk(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear la cuenta");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form action={handleSubmit} className="grid grid-cols-2 gap-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Usuario
        </label>
        <input
          name="username"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Nombre (opcional)
        </label>
        <input
          name="nombre"
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Rol
        </label>
        <select
          name="rol"
          defaultValue="tutor"
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="tutor">Tutor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}
      {ok && (
        <p className="col-span-2 text-sm text-green-600">
          Cuenta creada correctamente.
        </p>
      )}

      <div className="col-span-2 flex justify-end">
        <button
          type="submit"
          disabled={guardando}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {guardando ? "Creando..." : "Crear cuenta"}
        </button>
      </div>
    </form>
  );
}
