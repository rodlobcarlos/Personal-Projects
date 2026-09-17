import { NextFunction, Request, Response } from 'express';
import { AppError } from '../core/http-error';
import { config } from '../config/env';
import { logger } from '../config/logger';

export function routeNotFound(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
    return;
  }

  logger.error(`Error no controlado en ${req.method} ${req.originalUrl}`, {
    error: err instanceof Error ? { message: err.message, stack: err.stack } : err
  });

  const exposeStack = config.env !== 'production';
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Ocurrió un error interno en el servidor',
      ...(exposeStack && err instanceof Error ? { details: err.message } : {})
    }
  });
}