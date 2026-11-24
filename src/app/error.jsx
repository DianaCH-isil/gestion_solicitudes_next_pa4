"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Registro estructurado de errores para observabilidad en producción
    console.error("[PROD_ERROR_MONITOR]:", {
      mensaje: error?.message || "Error inesperado en cliente/servidor",
      digest: error?.digest || "N/A",
      ruta: typeof window !== "undefined" ? window.location.pathname : "server",
      fecha: new Date().toISOString(),
    });
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-md border border-red-200">
        <h2 className="text-xl font-bold text-red-600 mb-2">
          Ocurrió un error inesperado
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          El incidente ha sido registrado automáticamente en los logs de monitoreo.
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Reintentar operación
        </button>
      </div>
    </div>
  );
}