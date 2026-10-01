import NavBar from "@/components/NavBar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let esAdmin = false;
  if (user) {
    const { data } = await supabase
      .from("tutores")
      .select("rol")
      .eq("id", user.id)
      .single();
    esAdmin = data?.rol === "admin";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar esAdmin={esAdmin} />
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
