// PENDIENTE - Integrante 3 (Vistas Next.js SSR/SSG y Rutas Dinámicas)
export default async function SolicitudDetallePage({ params }) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-bold">Detalle de la solicitud</h1>
        <p className="mt-2 rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
          Pendiente — Integrante 3 (ruta dinámica SSR/SSG). Identificador
          recibido: <code className="font-mono">{id}</code>
        </p>
      </div>
    </main>
  );
}
