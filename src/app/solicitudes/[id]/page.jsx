import { obtenerSolicitud } from "@/src/services/api";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SolicitudDetallePage({ params }) {
  const { id } = await params;

  let solicitud = null;
  let error = null;

  try {
    solicitud = await obtenerSolicitud(id);
  } catch (err) {
    error = err.message || "No fue posible cargar la solicitud.";
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Link
          href="/solicitudes"
          className="text-sm text-blue-700 underline"
        >
          Volver a solicitudes
        </Link>

        <h1 className="mt-6 text-2xl font-bold">
          Detalle de la solicitud
        </h1>

        {error ? (
          <p className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        ) : (
          <section className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-white p-5">
            <p><strong>Radicado:</strong> {solicitud.codigoRadicado}</p>
            <p><strong>Tipo de trámite:</strong> {solicitud.tipoTramite}</p>
            <p><strong>Estado:</strong> {solicitud.estado}</p>
            <p><strong>Fecha:</strong> {solicitud.fechaRadicacion}</p>
            <p>
              <strong>Estudiante:</strong>{" "}
              {solicitud.estudiante?.nombre || "No disponible"}
            </p>
            <p>
              <strong>Justificación:</strong>{" "}
              {solicitud.justificacion || "No disponible"}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}