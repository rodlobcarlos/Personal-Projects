import type { NextFunction, Request, Response } from 'express';
import admin from '../config/firebase.js';
import { pool } from '../config/db.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string | null;
        name: string | null;
        picture: string | null;
      };
    }
  }
}

export async function verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'UNAUTHORIZED' });
    return;
  }

  try {
    const decoded = await admin.auth().verifyIdToken(header.slice(7));
    req.user = {
      uid: decoded.uid,
      email: decoded.email ?? null,
      name: decoded.name ?? null,
      picture: decoded.picture ?? null,
    };
    next();
  } catch {
    res.status(401).json({ error: 'INVALID_TOKEN' });
  }
}

export async function ensureUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: 'UNAUTHORIZED' });
    return;
  }

  await pool.query(
    `INSERT IGNORE INTO users (id, email, display_name, photo_url)
     VALUES (:id, :email, :displayName, :photoUrl)`,
    {
      id: user.uid,
      email: user.email,
      displayName: user.name,
      photoUrl: user.picture,
    },
  );

  next();
}

export const authenticate = [verifyToken, ensureUser];
