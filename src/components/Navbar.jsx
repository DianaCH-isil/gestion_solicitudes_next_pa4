"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

const RUTAS_PRINCIPALES = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/solicitudes", etiqueta: "Solicitudes" },
  { href: "/login", etiqueta: "Iniciar sesión" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { usuario, cargando, cerrarSesion } = useAuth();

  const nombreUsuario =
    usuario?.nombre || usuario?.correo || usuario?.email || "Usuario autenticado";

  const manejarCerrarSesion = () => {
    if (typeof cerrarSesion === "function") {
      cerrarSesion();
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white text-slate-900">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3"
      >
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-base font-bold tracking-tight text-slate-900"
          >
            Gestión de Solicitudes · PA4
          </Link>

          <ul className="flex flex-wrap items-center gap-4 text-sm">
            {RUTAS_PRINCIPALES.map((ruta) => {
              const esActiva =
                ruta.href === "/"
                  ? pathname === "/"
                  : pathname === ruta.href || pathname?.startsWith(`${ruta.href}/`);

              return (
                <li key={ruta.href}>
                  <Link
                    href={ruta.href}
                    className={
                      esActiva
                        ? "font-semibold text-slate-900 underline underline-offset-4"
                        : "text-slate-600 transition hover:text-slate-900"
                    }
                  >
                    {ruta.etiqueta}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {cargando ? (
            <span className="rounded bg-slate-100 px-2.5 py-1 text-slate-500">
              Verificando sesión...
            </span>
          ) : usuario ? (
            <>
              <span className="rounded bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700 border border-emerald-200">
                {nombreUsuario}
              </span>
              <button
                type="button"
                onClick={manejarCerrarSesion}
                className="rounded bg-slate-900 px-3 py-1.5 font-medium text-white transition hover:bg-slate-800"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded border border-slate-300 bg-slate-50 px-2.5 py-1 font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Sesión no iniciada
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
