// PENDIENTE - Integrante 4 (Configuración de Producción, Logs y Vercel)
export function info(mensaje, meta = {}) {
  console.log(`[INFO] ${mensaje}`, meta);
}

export function warn(mensaje, meta = {}) {
  console.warn(`[WARN] ${mensaje}`, meta);
}

export function error(mensaje, meta = {}) {
  console.error(`[ERROR] ${mensaje}`, meta);
}
