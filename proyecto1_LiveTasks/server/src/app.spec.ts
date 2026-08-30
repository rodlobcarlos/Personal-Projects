import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Server } from 'node:http';

const poolQuery = vi.fn();
const verifyIdToken = vi.fn();

vi.mock('./config/firebase.js', () => ({
  default: { auth: () => ({ verifyIdToken }) },
}));

vi.mock('./config/db.js', () => ({
  pool: { query: (...args: unknown[]) => poolQuery(...args) },
}));

const { createApp } = await import('./app.js');

describe('api app', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    await new Promise<void>((resolve) => {
      server = createApp().listen(0, () => resolve());
    });
    const addr = server.address();
    if (addr && typeof addr === 'object') {
      baseUrl = `http://127.0.0.1:${addr.port}`;
    }
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve())),
    );
  });

  beforeEach(() => {
    poolQuery.mockReset();
    verifyIdToken.mockReset();
  });

  it('responds 404 for unknown routes', async () => {
    const res = await fetch(`${baseUrl}/api/nope`);
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'NOT_FOUND' });
  });

  it('returns health ok when the db is reachable', async () => {
    poolQuery.mockResolvedValueOnce([{}]);
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string; db: string };
    expect(body.status).toBe('ok');
    expect(body.db).toBe('up');
  });

  it('returns 401 for protected routes without a token', async () => {
    const res = await fetch(`${baseUrl}/api/tasks`, { method: 'GET' });
    expect(res.status).toBe(401);
  });

  it('returns 503 for AI parse when Gemini is not configured', async () => {
    verifyIdToken.mockResolvedValueOnce({ uid: 'u1', email: null, name: null, picture: null });
    const res = await fetch(`${baseUrl}/api/ai/parse`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer valid' },
      body: JSON.stringify({ input: 'comprar pan' }),
    });
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: 'GEMINI_NOT_CONFIGURED' });
  });
});
