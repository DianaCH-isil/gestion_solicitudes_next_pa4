
import SolicitudesClient from "./SolicitudesClient";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { listarSolicitudesSinToken } from "@/src/services/api";

export const dynamic = "force-dynamic";

export default async function SolicitudesPage() {
  let solicitudes = [];
  let errorInicial = null;

  try {
    solicitudes = await listarSolicitudesSinToken();
  } catch (error) {
    errorInicial = error.message || "No fue posible cargar las solicitudes.";
  }

  // Vista privada: solo se muestra si hay una sesión activa.
  return (
    <ProtectedRoute>
      <SolicitudesClient
        solicitudesIniciales={solicitudes}
        errorInicial={errorInicial}
      />
    </ProtectedRoute>
  );
}
