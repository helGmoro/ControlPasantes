import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import CrearTutorForm from "./CrearTutorForm";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: miPerfil } = await supabase
    .from("tutores")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (miPerfil?.rol !== "admin") {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 text-red-600">
        No tenés permisos para ver esta sección.
      </div>
    );
  }

  const admin = createAdminClient();
  const { data: tutores } = await admin
    .from("tutores")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-900">
        Administración de tutores
      </h1>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <CrearTutorForm />
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
            <tr>
              <th className="px-4 py-2">Usuario</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Rol</th>
            </tr>
          </thead>
          <tbody>
            {(tutores ?? []).map((t) => (
              <tr key={t.id} className="border-t border-gray-100">
                <td className="px-4 py-2">{t.username}</td>
                <td className="px-4 py-2">{t.nombre ?? "-"}</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      t.rol === "admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {t.rol}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
