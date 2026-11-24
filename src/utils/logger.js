/**
 * Utilidad centralizada de Logs y Monitoreo para Producción
 * Integrante 4 — Configuración de Producción, Logs y Vercel (PA4)
 */

import { getRequestLog } from "@/services/api";

const isProduction = process.env.NODE_ENV === "production";
const monitoringEnabled = process.env.NEXT_PUBLIC_ENABLE_MONITORING !== "false";

export function info(mensaje, meta = {}) {
  // En producción se suprimen logs informativos rutinarios para mantener limpia la consola
  if (!isProduction && monitoringEnabled) {
    console.info(`[INFO] ${new Date().toISOString()} - ${mensaje}`, meta);
  }
}

export function warn(mensaje, meta = {}) {
  if (monitoringEnabled) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${mensaje}`, meta);
  }
}

export function error(mensaje, meta = {}) {
  // Los errores críticos siempre se registran en producción para observabilidad en Vercel Logs
  console.error(`[PROD_ERROR_LOG] ${new Date().toISOString()} - ${mensaje}`, {
    environment: process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV,
    ...meta,
  });
}

// Consolida la bitácora HTTP generada por src/services/api.js (Integrante 1)
export function flushApiLogs() {
  const bitacora = typeof getRequestLog === "function" ? getRequestLog() : [];
  if (bitacora.length > 0 && monitoringEnabled) {
    console.warn("[API_AUDIT_LOG] Resumen de peticiones registradas:", bitacora);
  }
  return bitacora;
}

export const logger = {
  info,
  warn,
  error,
  flushApiLogs,
};

export default logger;