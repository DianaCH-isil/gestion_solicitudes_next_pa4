import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-16">
      
        <h1 className="mt-2 text-3xl font-bold">
          Plataforma de Gestión de Solicitudes Académicas
        </h1>

        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold">Listado de solicitudes</h2>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link
                href="/solicitudes"
                className="text-slate-700 underline underline-offset-4"
              >
                Ver solicitudes 
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
