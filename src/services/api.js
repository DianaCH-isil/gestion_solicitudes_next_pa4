
import {
  ApiError,
  ERROR_TYPES,
  extractServerMessage,
  formatValidationDetails,
  normalizeError,
  statusToType,
} from '../utils/errorHandler';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const TOKEN_STORAGE_KEY = 'isil_jwt_token';

export const DEFAULT_TIMEOUT_MS = 10000;

const MAX_LOG_ENTRIES = 60;

const requestLog = [];

export function getRequestLog() {
  return [...requestLog].reverse();
}

export function clearRequestLog() {
  requestLog.length = 0;
}

function registerLog(entry) {
  requestLog.push(entry);
  if (requestLog.length > MAX_LOG_ENTRIES) requestLog.shift();
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  if (typeof window === 'undefined' || !token) return;
  try {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
  }
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
  }
}

export function hasToken() {
  return Boolean(getToken());
}

export async function apiRequest(endpoint, options = {}) {
  const {
    method = 'GET',
    body,
    auth = true,
    timeout = DEFAULT_TIMEOUT_MS,
    headers = {},
    baseUrl = API_BASE_URL,
    validate,
  } = options;

  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const startedAt = Date.now();

  const requestHeaders = { Accept: 'application/json', ...headers };
  let payload;

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  if (auth) {
    const token = getToken();
    if (token) requestHeaders.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  let response;
  let data;

  try {
    response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: payload,
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await response.json().catch(() => null);
    } else {
      data = await response.text().catch(() => null);
    }
  } catch (error) {
    const apiError = normalizeError(error, { endpoint, method });
    registerLog({
      timestamp: new Date().toISOString(),
      method,
      url,
      status: apiError.status,
      durationMs: Date.now() - startedAt,
      ok: false,
      type: apiError.type,
      message: apiError.message,
    });
    throw apiError;
  } finally {
    clearTimeout(timer);
  }

  const durationMs = Date.now() - startedAt;

  if (!response.ok) {
    const apiError = new ApiError(extractServerMessage(data, response.status), {
      status: response.status,
      type: statusToType(response.status),
      endpoint,
      method,
      details: data?.detalles ?? null,
    });
    registerLog({
      timestamp: new Date().toISOString(),
      method,
      url,
      status: response.status,
      durationMs,
      ok: false,
      type: apiError.type,
      message: apiError.message,
    });
    throw apiError;
  }

  registerLog({
    timestamp: new Date().toISOString(),
    method,
    url,
    status: response.status,
    durationMs,
    ok: true,
    type: 'OK',
    message: `Respuesta ${response.status}`,
  });

  if (typeof validate === 'function') {
    try {
      validate(data);
    } catch (error) {
      const detalle =
        error instanceof Error
          ? error.message
          : 'La respuesta no cumple el formato esperado.';
      throw new ApiError(detalle, {
        status: response.status,
        type: ERROR_TYPES.VALIDATION,
        endpoint,
        method,
        details: data?.detalles ?? null,
      });
    }
  }

  return data;
}

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

function assertArray(data, nombre) {
  if (!Array.isArray(data)) {
    throw new Error(`La respuesta de "${nombre}" no es una lista válida.`);
  }
}

export function healthCheck() {
  return apiRequest('/api/health', {
    auth: false,
    validate: (data) => {
      if (!data || data.estado !== 'OK') {
        throw new Error('El backend respondió pero no reporta estado OK.');
      }
    },
  });
}

export async function login(correo, password) {
  const data = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: { correo, password },
    auth: false,
    validate: (response) => {
      if (!response?.token) {
        throw new Error('La API no devolvió un token JWT válido.');
      }
    },
  });
  setToken(data.token);
  return data;
}

export function register(payload) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: payload,
    auth: false,
  });
}

export function getPerfil() {
  return apiRequest('/api/auth/me', {
    validate: (data) => {
      if (!data?.usuario) throw new Error('El backend no devolvió el perfil del usuario.');
    },
  });
}

export function listarSolicitudes(filtros = {}) {
  return apiRequest(`/api/solicitudes${buildQuery(filtros)}`, {
    validate: (data) => assertArray(data, 'solicitudes'),
  });
}

export function listarMisSolicitudes() {
  return apiRequest('/api/solicitudes/mias', {
    validate: (data) => assertArray(data, 'mis solicitudes'),
  });
}

export function obtenerSolicitud(id) {
  return apiRequest(`/api/solicitudes/${encodeURIComponent(id)}`, {
    validate: (data) => {
      if (!data || !data.codigoRadicado) {
        throw new Error('No se encontró la solicitud solicitada.');
      }
    },
  });
}

export function crearSolicitud(payload) {
  return apiRequest('/api/solicitudes', { method: 'POST', body: payload });
}

export function actualizarEstadoSolicitud(id, estado) {
  return apiRequest(`/api/solicitudes/${encodeURIComponent(id)}/estado`, {
    method: 'PATCH',
    body: { estado },
  });
}

export function eliminarSolicitud(id) {
  return apiRequest(`/api/solicitudes/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export function listarUsuarios() {
  return apiRequest('/api/usuarios', {
    validate: (data) => assertArray(data, 'usuarios'),
  });
}

export function listarEstudiantes() {
  return apiRequest('/api/estudiantes', {
    validate: (data) => assertArray(data, 'estudiantes'),
  });
}

export function listarSolicitudesSinToken() {
  return apiRequest('/api/solicitudes', {
    auth: false,
    validate: (data) => assertArray(data, 'solicitudes'),
  });
}

export function simularErrorServidor() {
  const apiError = new ApiError(
    'Error interno del servidor (500) - inyección de fallo controlada para verificación.',
    {
      status: 500,
      type: ERROR_TYPES.SERVER,
      endpoint: '/api/solicitudes',
      method: 'GET',
    }
  );
  registerLog({
    timestamp: new Date().toISOString(),
    method: 'GET',
    url: `${API_BASE_URL}/api/solicitudes`,
    status: 500,
    durationMs: 0,
    ok: false,
    type: apiError.type,
    message: apiError.message,
  });
  throw apiError;
}

export function getErrorDetails(error) {
  const details = error?.details;
  if (!details) return null;
  return formatValidationDetails(details);
}

export const api = {
  healthCheck,
  login,
  register,
  getPerfil,
  listarSolicitudes,
  listarMisSolicitudes,
  obtenerSolicitud,
  crearSolicitud,
  actualizarEstadoSolicitud,
  eliminarSolicitud,
  listarUsuarios,
  listarEstudiantes,
  listarSolicitudesSinToken,
  simularErrorServidor,
};

export default api;
