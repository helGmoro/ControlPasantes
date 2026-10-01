"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/lib/toast";

const LINKS = [
  { href: "/asistencia", label: "Asistencia" },
  { href: "/pasantes", label: "Pasantes" },
  { href: "/historial", label: "Historial" },
  { href: "/planilla", label: "Planilla" },
];

export default function NavBar({ esAdmin }: { esAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const links = esAdmin
    ? [...LINKS, { href: "/admin", label: "Administración" }]
    : LINKS;

  async function handleLogout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("No se pudo cerrar sesión. Intentá nuevamente.");
      return;
    }

    toast.info("Sesión cerrada");
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="no-print sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-gray-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur sm:gap-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-4 sm:gap-8">
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-semibold text-white shadow-sm">
          CA
        </span>
        <div className="flex min-w-0 gap-4 overflow-x-auto sm:gap-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-shrink-0 border-b-2 pb-1 text-sm transition-colors ${
                pathname.startsWith(link.href)
                  ? "border-blue-600 font-medium text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="flex-shrink-0 text-sm text-gray-500 transition-colors hover:text-gray-900"
      >
        Cerrar sesión
      </button>
    </nav>
  );
}
