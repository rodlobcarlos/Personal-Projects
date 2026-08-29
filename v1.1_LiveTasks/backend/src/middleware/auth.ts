import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../models/User';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No autorizado: token no proporcionado' });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };

    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ message: 'No autorizado: usuario no encontrado' });
      return;
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'No autorizado: token inválido o expirado' });
  }
};
