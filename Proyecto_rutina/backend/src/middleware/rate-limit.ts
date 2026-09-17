import rateLimit from 'express-rate-limit';

const defaultOptions = {
  standardHeaders: true,
  legacyHeaders: false
};

/** Límite sensible para autenticación (login, registro, refresh). */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: { code: 'TOO_MANY_REQUESTS', message: 'Demasiados intentos, espere unos minutos' }
  },
  ...defaultOptions
});

/** Límite global para el resto de la API. */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    error: { code: 'TOO_MANY_REQUESTS', message: 'Límite de peticiones alcanzado' }
  },
  ...defaultOptions
});