export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  method: string;
  status: string;
  statusCode: number;
  path: string;
  timestamp: string;
  message: string;
  errors?: FieldError[];
}

/**
 * Error normalizado a partir de la respuesta estándar de la API.
 * Toda llamada que falla (red o backend) termina como un ApiError,
 * de modo que en la UI siempre se captura el mismo tipo.
 */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly status: string;
  readonly path: string;
  readonly method: string;
  readonly timestamp: string;
  readonly errors: FieldError[];

  constructor(response: ApiErrorResponse) {
    super(response.message);
    this.name = 'ApiError';
    this.statusCode = response.statusCode;
    this.status = response.status;
    this.path = response.path;
    this.method = response.method;
    this.timestamp = response.timestamp;
    this.errors = response.errors ?? [];
  }

  /** Sin respuesta del servidor (timeout, CORS, offline). */
  get isNetwork(): boolean {
    return this.statusCode === 0;
  }

  /** 400 o respuesta con errores de campo (formularios). */
  get isValidation(): boolean {
    return this.statusCode === 400 || this.errors.length > 0;
  }

  /** 401 — token ausente, inválido o expirado. */
  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  /** 403 — autenticado pero sin permisos. */
  get isForbidden(): boolean {
    return this.statusCode === 403;
  }

  /** 404 — recurso no encontrado. */
  get isNotFound(): boolean {
    return this.statusCode === 404;
  }

  /** 409 — conflicto (ej. registro duplicado). */
  get isConflict(): boolean {
    return this.statusCode === 409;
  }

  /** 5xx — error del servidor. */
  get isServerError(): boolean {
    return this.statusCode >= 500;
  }

  /** Mensaje de error de un campo concreto (útil para formularios). */
  fieldError(field: string): string | undefined {
    return this.errors.find((error) => error.field === field)?.message;
  }

  /** Errores de campo como Record<field, message> (útil para setError de react-hook-form). */
  fieldErrors(): Record<string, string> {
    return Object.fromEntries(this.errors.map((error) => [error.field, error.message]));
  }
}
