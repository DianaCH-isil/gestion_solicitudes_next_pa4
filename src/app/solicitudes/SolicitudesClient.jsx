"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  listarSolicitudes,
  login,
  obtenerSolicitud,
} from "@/src/services/api";
import { handleError } from "@/src/utils/errorHandler";
import Navbar from "@/src/components/Navbar";

const DEMO_CORREO = process.env.NEXT_PUBLIC_DEMO_CORREO || "admin@isil.pe";
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "123";

const ESTILO_ESTADO = {
  Aprobada: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "En Revisión": "bg-amber-50 text-amber-700 border-amber-200",
  Pendiente: "bg-sky-50 text-sky-700 border-sky-200",
  Rechazada: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function SolicitudesClient({
  solicitudesIniciales = [],
  errorInicial = null,
}) {
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(errorInicial);
  const [termino, setTermino] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [detalleCargando, setDetalleCargando] = useState(false);

  const iniciarSesionDemo = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      await login(DEMO_CORREO, DEMO_PASSWORD);
      const data = await listarSolicitudes();
      setSolicitudes(data);
    } catch (err) {
      const info = handleError(err, {
        endpoint: "/api/auth/login",
        method: "POST",
      });
      setError(info);
      setSolicitudes([]);
    } finally {
      setCargando(false);
    }
  }, []);

  const cargarSolicitudes = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await listarSolicitudes();
      setSolicitudes(data);
    } catch (err) {
      const info = handleError(err, {
        endpoint: "/api/solicitudes",
        method: "GET",
      });
      if (info.status === 401) {
        await iniciarSesionDemo();
        return;
      }
      setError(info);
      setSolicitudes([]);
    } finally {
      setCargando(false);
    }
  }, [iniciarSesionDemo]);

  useEffect(() => {
  if (errorInicial) {
    cargarSolicitudes();
  }
}, [errorInicial, cargarSolicitudes]);

  const buscar = async () => {
    setBusqueda(termino);
    await cargarSolicitudes();
  };

  const verDetalle = async (solicitud) => {
  const solicitudId = solicitud._id || solicitud.id;

  if (detalle && (detalle._id || detalle.id) === solicitudId) {
    setDetalle(null);
    return;
  }

  setDetalleCargando(true);
  setError(null);

  try {
    const data = await obtenerSolicitud(solicitudId);
    setDetalle(data);
  } catch (err) {
    const info = handleError(err, {
      endpoint: `/api/solicitudes/${solicitudId}`,
      method: "GET",
    });
    setError(info);
  } finally {
    setDetalleCargando(false);
  }
};

  const filtradas = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    if (!term) return solicitudes;
    return solicitudes.filter((s) =>
      [
        s.codigoRadicado,
        s.tipoTramite,
        s.estado,
        (s.estudiante && s.estudiante.nombre) || "",
        (s.estudiante && s.estudiante.codigo) || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [solicitudes, busqueda]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <header className="mb-6">
            <h1 className="text-2xl font-bold">Listado de solicitudes</h1>
          </header>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800">
              <p className="font-semibold">
                Error {error.status ? `HTTP ${error.status}` : ""} · {error.tipo}
              </p>
              <p>{error.mensaje}</p>
              {error.detalles && (
                <p className="mt-1 text-xs">Detalle: {error.detalles}</p>
              )}
            </div>
          )}

          <section className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-white p-4">
            <div className="min-w-[200px] flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Búsqueda
              </label>
              <input
                value={termino}
                onChange={(e) => setTermino(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") buscar();
                }}
                placeholder="Radicado, tipo de trámite o estudiante"
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm"
              />
            </div>
            <button
              onClick={buscar}
              disabled={cargando}
              className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {cargando ? "Buscando..." : "Buscar"}
            </button>
          </section>

          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-semibold">
                {filtradas.length} solicitud(es)
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                  <tr>
                    <th className="px-4 py-2">Radicado</th>
                    <th className="px-4 py-2">Tipo de trámite</th>
                    <th className="px-4 py-2">Estudiante</th>
                    <th className="px-4 py-2">Fecha</th>
                    <th className="px-4 py-2">Estado</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {filtradas.map((s) => (
                    <tr key={s._id || s.id || s.codigoRadicado} className="border-t border-slate-100">
                      <td className="px-4 py-2 font-mono text-xs">
                        {s.codigoRadicado}
                      </td>
                      <td className="px-4 py-2">
                        {s.tipoTramite}
                        <span className="block text-xs text-slate-500">
                          {s.descripcionDetalle}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {(s.estudiante && s.estudiante.nombre) || "—"}
                        <span className="block text-xs text-slate-500">
                          {(s.estudiante && s.estudiante.codigo) || ""}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-slate-600">{s.fechaRadicacion}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${
                            ESTILO_ESTADO[s.estado] ||
                            "border-slate-200 bg-slate-50 text-slate-700"
                          }`}
                        >
                          {s.estado}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => verDetalle(s)}
                          className="text-xs font-medium text-slate-600 underline hover:text-slate-900"
                        >
                          {detalle && (detalle._id || detalle.id) === (s._id || s.id) ? "Ocultar" : "Detalle"}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtradas.length === 0 && !cargando && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-slate-500"
                      >
                        No hay solicitudes para mostrar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {detalleCargando && (
            <p className="mt-3 text-sm text-slate-600">
              Consultando GET /api/solicitudes/:id ...
            </p>
          )}

          {detalle && (
            <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  Detalle · {detalle.codigoRadicado}
                </h3>
                <button
                  onClick={() => setDetalle(null)}
                  className="text-xs text-slate-500 underline"
                >
                  Cerrar
                </button>
              </div>
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-slate-500">Tipo de trámite</dt>
                  <dd>{detalle.tipoTramite}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Detalle</dt>
                  <dd>{detalle.descripcionDetalle}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Estudiante</dt>
                  <dd>
                    {(detalle.estudiante && detalle.estudiante.nombre) || "—"}{" "}
                    <span className="text-slate-500">
                      {(detalle.estudiante && detalle.estudiante.carrera) || ""}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Fecha de radicación</dt>
                  <dd>{detalle.fechaRadicacion}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-slate-500">Justificación</dt>
                  <dd className="text-slate-700">{detalle.justificacion}</dd>
                </div>
              </dl>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
