
import SolicitudesClient from "./SolicitudesClient";
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

  return (
    <SolicitudesClient
      solicitudesIniciales={solicitudes}
      errorInicial={errorInicial}
    />
  );
}
