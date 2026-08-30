import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

const verifyIdToken = vi.fn();

vi.mock('../config/firebase.js', () => ({
  default: {
    auth: () => ({ verifyIdToken }),
  },
}));

vi.mock('../config/db.js', () => ({
  pool: { query: vi.fn(async () => []) },
}));

import { verifyToken } from './auth.js';

function makeReq(headers: Record<string, string> = {}): Request {
  return { headers } as unknown as Request;
}

function makeRes(): Response & { statusCode: number; body: unknown } {
  const res = {
    statusCode: 200,
    body: undefined,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(obj: unknown) {
      this.body = obj;
      return this;
    },
  } as unknown as Response & { statusCode: number; body: unknown };
  return res;
}

describe('verifyToken', () => {
  beforeEach(() => {
    verifyIdToken.mockReset();
  });

  it('returns 401 when the Authorization header is missing', async () => {
    const req = makeReq({});
    const res = makeRes();
    const next = vi.fn();
    await verifyToken(req, res, next as unknown as NextFunction);
    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when Authorization is not a Bearer token', async () => {
    const req = makeReq({ authorization: 'Basic abc' });
    const res = makeRes();
    const next = vi.fn();
    await verifyToken(req, res, next as unknown as NextFunction);
    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when the token is invalid', async () => {
    verifyIdToken.mockRejectedValueOnce(new Error('invalid'));
    const req = makeReq({ authorization: 'Bearer bad-token' });
    const res = makeRes();
    const next = vi.fn();
    await verifyToken(req, res, next as unknown as NextFunction);
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: 'INVALID_TOKEN' });
    expect(next).not.toHaveBeenCalled();
  });

  it('sets req.user and calls next() with a valid token', async () => {
    verifyIdToken.mockResolvedValueOnce({ uid: 'u123', email: 'a@b.c', name: 'Ana', picture: null });
    const req = makeReq({ authorization: 'Bearer valid-token' });
    const res = makeRes();
    const next = vi.fn();
    await verifyToken(req, res, next as unknown as NextFunction);
    expect(verifyIdToken).toHaveBeenCalledWith('valid-token');
    expect((req as unknown as { user?: unknown }).user).toEqual({
      uid: 'u123',
      email: 'a@b.c',
      name: 'Ana',
      picture: null,
    });
    expect(next).toHaveBeenCalled();
  });
});
