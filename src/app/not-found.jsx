import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        404 - Página no encontrada
      </h2>
      <p className="text-gray-600 mb-4">
        La ruta solicitada no existe en el sistema de gestión de solicitudes.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Volver al inicio
      </Link>
    </div>
  );
}