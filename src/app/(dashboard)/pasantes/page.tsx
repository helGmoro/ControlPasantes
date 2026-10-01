import { createClient } from "@/lib/supabase/server";
import type { Pasante } from "@/lib/types";
import PasantesTable from "./PasantesTable";

export default async function PasantesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pasantes")
    .select("*")
    .order("apellido", { ascending: true });

  if (error) {
    return <p className="text-red-600">Error al cargar pasantes: {error.message}</p>;
  }

  return <PasantesTable pasantes={(data ?? []) as Pasante[]} />;
}
