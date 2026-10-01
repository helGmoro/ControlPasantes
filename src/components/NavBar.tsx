"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="no-print flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
      <div className="flex items-center gap-6">
        <span className="font-semibold text-gray-900">Pasantes</span>
        <div className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm ${
                pathname.startsWith(link.href)
                  ? "font-medium text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="text-sm text-gray-500 hover:text-gray-900"
      >
        Cerrar sesión
      </button>
    </nav>
  );
}
