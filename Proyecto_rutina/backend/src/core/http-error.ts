export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(statusCode: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code ?? httpCodeToErrorCode(statusCode);
    this.details = details;
    Error.captureStackTrace(this, AppError);
  }
}

function httpCodeToErrorCode(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 422:
      return 'UNPROCESSABLE_ENTITY';
    case 429:
      return 'TOO_MANY_REQUESTS';
    default:
      return 'INTERNAL_ERROR';
  }
}

export function notFound(message = 'Recurso no encontrado'): AppError {
  return new AppError(404, message);
}

export function unauthorized(message = 'No autorizado'): AppError {
  return new AppError(401, message);
}

export function forbidden(message = 'Acceso denegado'): AppError {
  return new AppError(403, message);
}

export function conflict(message: string): AppError {
  return new AppError(409, message);
}