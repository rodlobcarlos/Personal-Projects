import { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/orm';
import { config } from '../config/env';
import { User } from '../entities/User';
import { unauthorized } from '../core/http-error';

export interface AuthUser {
  id: number;
  email: string;
  timezone: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/** Middleware de autenticación: valida el Bearer token y carga el usuario. */
export const authenticate: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(unauthorized('Falta el token de acceso'));
    return;
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, config.jwt.secret) as { sub?: number; email?: string; type?: string };
    if (payload.type !== 'access' || typeof payload.sub !== 'number') {
      next(unauthorized('Token inválido'));
      return;
    }
    void resolveAndAttach(payload, req, next);
  } catch {
    next(unauthorized('Token expirado o inválido'));
  }
};

async function resolveAndAttach(
  payload: { sub?: number; email?: string },
  req: Request,
  next: NextFunction
): Promise<void> {
  try {
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOne({ where: { id: payload.sub }, select: ['id', 'email', 'timezone'] });
    if (!user) {
      next(unauthorized('Usuario no encontrado'));
      return;
    }
    req.user = { id: user.id, email: user.email, timezone: user.timezone };
    next();
  } catch (error) {
    next(error);
  }
}