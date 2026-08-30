import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('isGeminiAvailable', () => {
  it('returns false when GEMINI_API_KEY is empty', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');
    const { isGeminiAvailable } = await import('./gemini.js');
    expect(isGeminiAvailable()).toBe(false);
  });

  it('returns true when GEMINI_API_KEY is set', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'fake-key');
    const { isGeminiAvailable } = await import('./gemini.js');
    expect(isGeminiAvailable()).toBe(true);
  });
});
