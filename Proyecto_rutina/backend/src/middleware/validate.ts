import { NextFunction, Request, RequestHandler, Response } from 'express';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';
import { AppError } from '../core/http-error';

const defaultOptions: ValidatorOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  validationError: { target: false, value: false }
};

function extractMessages(errors: Array<{ property: string; constraints?: Record<string, string> }>): Record<string, string> {
  const messages: Record<string, string> = {};
  for (const error of errors) {
    const firstConstraint = error.constraints ? Object.values(error.constraints)[0] : 'Invalid value';
    messages[error.property] = firstConstraint;
  }
  return messages;
}

/** Valida el cuerpo de la petición contra un DTO de class-validator. */
export function validateBody<T extends object>(dtoClass: new () => T): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const instance = plainToInstance(dtoClass, req.body as object) as T;
    const errors = await validate(instance as object, defaultOptions);
    if (errors.length > 0) {
      next(new AppError(422, 'Datos de entrada inválidos', 'VALIDATION_ERROR', extractMessages(errors)));
      return;
    }
    req.body = instanceToPlain(instance);
    next();
  };
}