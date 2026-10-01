"use client";

import { useRef, useState } from "react";
import { crearTutor } from "./actions";
import { toast } from "@/lib/toast";

export default function CrearTutorForm() {
  const [guardando, setGuardando] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setGuardando(true);
    try {
      await crearTutor(formData);
      toast.success("Cuenta creada correctamente");
      formRef.current?.reset();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "No se pudo crear la cuenta"
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Usuario
        </label>
        <input
          name="username"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Nombre (opcional)
        </label>
        <input
          name="nombre"
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Rol
        </label>
        <select
          name="rol"
          defaultValue="tutor"
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="tutor">Tutor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="flex justify-end sm:col-span-2">
        <button
          type="submit"
          disabled={guardando}
          className="rounded-md bg-gradient-to-br from-blue-500 to-blue-700 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-transform hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
        >
          {guardando ? "Creando..." : "Crear cuenta"}
        </button>
      </div>
    </form>
  );
}
