import Link from "next/link";
import Navbar from "@/src/components/Navbar";
import { obtenerPrimeraSolicitud } from "@/src/services/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  let solicitud = null;

  try {
    solicitud = await obtenerPrimeraSolicitud();
  } catch {
    solicitud = null;
  }

  const idSolicitud = solicitud?._id || solicitud?.id || solicitud?.codigoRadicado || null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-14">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            ISIL · Programación Web II · PA4
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Plataforma de Gestión de Solicitudes Académicas
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Consulta y gestión de solicitudes académicas con integración API,
            autenticación JWT, renderizado SSR y rutas dinámicas en Next.js.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/solicitudes"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Ver listado de solicitudes
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
            >
              Iniciar sesión
            </Link>
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Accesos principales del sistema
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>
              <Link
                href="/solicitudes"
                className="underline underline-offset-4 hover:text-slate-900"
              >
                Gestión y consulta de solicitudes (/solicitudes)
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="underline underline-offset-4 hover:text-slate-900"
              >
                Autenticación y sesión JWT (/login)
              </Link>
            </li>
            <li>
              {idSolicitud ? (
                <Link
                  href={`/solicitudes/${idSolicitud}`}
                  className="underline underline-offset-4 hover:text-slate-900"
                >
                  Detalle dinámico de solicitud (/solicitudes/[id])
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="cursor-not-allowed text-slate-400 underline underline-offset-4"
                >
                  Detalle dinámico de solicitud (/solicitudes/[id]) (Aún no hay datos)
                </span>
              )}
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
