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
        <span className="flex items-center gap-2 font-semibold text-gray-900">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
            P
          </span>
          Pasantes
        </span>
        <div className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`border-b-2 pb-1 text-sm ${
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
        className="text-sm text-gray-500 hover:text-gray-900"
      >
        Cerrar sesión
      </button>
    </nav>
  );
}
