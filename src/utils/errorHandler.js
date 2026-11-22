export const ERROR_TYPES = Object.freeze({
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  AUTH: 'AUTH_ERROR',
  FORBIDDEN: 'FORBIDDEN_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  CONFLICT: 'CONFLICT_ERROR',
  SERVER: 'SERVER_ERROR',
  PARSE: 'PARSE_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
});

export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status ?? 0;
    this.type = options.type ?? ERROR_TYPES.UNKNOWN;
    this.endpoint = options.endpoint ?? '';
    this.method = options.method ?? 'GET';
    this.details = options.details ?? null;
    this.originalError = options.originalError ?? null;
    this.timestamp = new Date().toISOString();
  }

  get isAuthError() {
    return this.status === 401 || this.type === ERROR_TYPES.AUTH;
  }

  get isRetryable() {
    return (
      this.type === ERROR_TYPES.NETWORK ||
      this.type === ERROR_TYPES.TIMEOUT ||
      this.status >= 500
    );
  }
}

export function statusToType(status) {
  switch (status) {
    case 400:
    case 422:
      return ERROR_TYPES.VALIDATION;
    case 401:
      return ERROR_TYPES.AUTH;
    case 403:
      return ERROR_TYPES.FORBIDDEN;
    case 404:
      return ERROR_TYPES.NOT_FOUND;
    case 409:
      return ERROR_TYPES.CONFLICT;
    case 408:
      return ERROR_TYPES.TIMEOUT;
    default:
      break;
  }
  if (status >= 500) return ERROR_TYPES.SERVER;
  if (status >= 400) return ERROR_TYPES.VALIDATION;
  return ERROR_TYPES.UNKNOWN;
}

export function extractServerMessage(data, status) {
  if (data && typeof data === 'object') {
    if (typeof data.mensaje === 'string' && data.mensaje.trim()) return data.mensaje;
    if (typeof data.error === 'string' && data.error.trim()) return data.error;
    if (Array.isArray(data.detalles) && data.detalles.length) {
      return formatValidationDetails(data.detalles);
    }
  }
  return `La API respondió con el estado HTTP ${status}.`;
}

export function formatValidationDetails(detalles) {
  if (!Array.isArray(detalles) || detalles.length === 0) return '';
  return detalles
    .map((detalle) => {
      const mensaje = detalle?.msg || detalle?.message || 'Dato inválido';
      const campo = detalle?.path || detalle?.field || '';
      return campo ? `${campo}: ${mensaje}` : mensaje;
    })
    .join(' | ');
}

export function normalizeError(error, context = {}) {
  if (error instanceof ApiError) {
    if (!error.endpoint && context.endpoint) error.endpoint = context.endpoint;
    if (!error.method && context.method) error.method = context.method;
    return error;
  }

  const nombre = error?.name || '';
  const mensajeOriginal = error?.message || 'Error desconocido';

  if (nombre === 'AbortError') {
    return new ApiError(
      'La solicitud tardó demasiado y fue cancelada. Verifique que el backend esté encendido.',
      { type: ERROR_TYPES.TIMEOUT, status: 0, ...context, originalError: error }
    );
  }

  if (error instanceof SyntaxError || nombre === 'SyntaxError') {
    return new ApiError(
      'La respuesta del servidor no tiene un formato JSON válido.',
      { type: ERROR_TYPES.PARSE, status: 0, ...context, originalError: error }
    );
  }

  if (error instanceof TypeError) {
    return new ApiError(
      'No se pudo conectar con la API. Confirme que el backend Node.js esté ejecutándose en el puerto configurado.',
      { type: ERROR_TYPES.NETWORK, status: 0, ...context, originalError: error }
    );
  }

  const status = error?.status ?? error?.response?.status ?? 0;
  return new ApiError(mensajeOriginal, {
    type: status ? statusToType(status) : ERROR_TYPES.UNKNOWN,
    status,
    ...context,
    originalError: error,
  });
}

export function getFriendlyMessage(apiError) {
  if (!apiError) return 'Ocurrió un error inesperado.';

  switch (apiError.type) {
    case ERROR_TYPES.AUTH:
      return 'Sesión no autorizada (401). Inicie sesión nuevamente para obtener un token JWT válido.';
    case ERROR_TYPES.FORBIDDEN:
      return 'Acceso denegado (403). Su rol no tiene permisos para esta operación.';
    case ERROR_TYPES.NOT_FOUND:
      return 'Recurso no encontrado (404). Verifique el identificador o la ruta consultada.';
    case ERROR_TYPES.VALIDATION:
      return 'Los datos enviados no son válidos (400). Revise los campos del formulario.';
    case ERROR_TYPES.CONFLICT:
      return 'Conflicto (409). El registro ya existe o el estado solicitado no es válido.';
    case ERROR_TYPES.SERVER:
      return 'Error interno del servidor (500). Intente nuevamente en unos segundos.';
    case ERROR_TYPES.NETWORK:
      return 'Error de conexión. No se pudo alcanzar el servidor de la API.';
    case ERROR_TYPES.TIMEOUT:
      return 'Tiempo de espera agotado. La API tardó demasiado en responder.';
    case ERROR_TYPES.PARSE:
      return 'La respuesta del servidor no pudo interpretarse.';
    default:
      return apiError.message || 'Ocurrió un error inesperado.';
  }
}

export function handleError(error, context = {}) {
  const apiError = normalizeError(error, context);
  const mensaje = getFriendlyMessage(apiError);

  logError(apiError, mensaje);

  return {
    mensaje,
    tipo: apiError.type,
    status: apiError.status,
    detalles: apiError.details ? formatValidationDetails(apiError.details) : null,
    endpoint: apiError.endpoint,
    method: apiError.method,
    timestamp: apiError.timestamp,
    reintentable: apiError.isRetryable,
  };
}

export function logError(apiError, mensaje) {
  if (typeof console === 'undefined') return;
  console.groupCollapsed(
    `%c[API] ${apiError.method} ${apiError.endpoint} → ${apiError.status || 'sin respuesta'} (${apiError.type})`,
    'color:#b91c1c;font-weight:bold'
  );
  console.warn('Mensaje para el usuario:', mensaje);
  console.warn('Error original:', apiError.originalError || apiError.message);
  if (apiError.details) console.warn('Detalles:', apiError.details);
  console.groupEnd();
}

export function isApiError(value) {
  return value instanceof ApiError;
}
