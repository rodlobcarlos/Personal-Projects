import { DataSource } from 'typeorm';

let testDataSource: DataSource;

jest.mock('../src/config/orm', () => ({
  get AppDataSource(): DataSource {
    return testDataSource;
  },
  initDataSource: jest.fn()
}));

// El mock se establece ANTES de cualquier import del módulo a testear.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { AuthService } = require('../src/modules/auth/auth.service') as typeof import('../src/modules/auth/auth.service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createTestDataSource, seedDemoUser } = require('./helpers/test-db') as typeof import('./helpers/test-db');

beforeAll(async () => {
  testDataSource = await createTestDataSource();
  await seedDemoUser(testDataSource);
});

afterAll(async () => {
  if (testDataSource?.isInitialized) {
    await testDataSource.destroy();
  }
});

describe('AuthService', () => {
  let service: InstanceType<typeof AuthService>;

  beforeEach(() => {
    service = new AuthService();
  });

  describe('register', () => {
    it('crea usuario y devuelve tokens válidos', async () => {
      const result = await service.register({
        email: 'nuevo@test.com',
        password: 'Clave1234!',
        name: 'Nuevo',
        timezone: 'Europe/Madrid'
      });

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('nuevo@test.com');
      expect(result.user.name).toBe('Nuevo');
      expect(result.user.timezone).toBe('Europe/Madrid');
      expect(result.tokens.accessToken).toBeTruthy();
      expect(result.tokens.refreshToken).toBeTruthy();
      expect(result.tokens.expiresIn).toBeGreaterThan(0);
      expect(result.tokens.tokenType).toBe('Bearer');
    });

    it('lanza 409 si el email ya existe', async () => {
      await expect(
        service.register({ email: 'demo@test.com', password: 'Clave1234!', name: 'Dup' })
      ).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe('login', () => {
    it('devuelve tokens con credenciales válidas', async () => {
      const result = await service.login({ email: 'demo@test.com', password: 'Test1234!' });
      expect(result.tokens.accessToken).toBeTruthy();
      expect(result.user.email).toBe('demo@test.com');
    });

    it('lanza 401 con credenciales inválidas', async () => {
      await expect(
        service.login({ email: 'demo@test.com', password: 'incorrecta' })
      ).rejects.toMatchObject({ statusCode: 401 });
    });
  });

  describe('refresh', () => {
    it('emite nuevos tokens al refrescar uno válido y rota el refresh', async () => {
      const { tokens } = await service.login({ email: 'demo@test.com', password: 'Test1234!' });
      const newTokens = await service.refresh(tokens.refreshToken);
      expect(newTokens.accessToken).toBeTruthy();
      expect(newTokens.refreshToken).not.toBe(tokens.refreshToken);
      expect(newTokens.expiresIn).toBeGreaterThan(0);
    });

    it('lanza 401 al intentar reusar un refresh token ya usado (rotación)', async () => {
      const { tokens } = await service.login({ email: 'demo@test.com', password: 'Test1234!' });
      await service.refresh(tokens.refreshToken);
      await expect(service.refresh(tokens.refreshToken)).rejects.toMatchObject({ statusCode: 401 });
    });
  });

  describe('logout', () => {
    it('revoca un refresh token y ya no se puede usar', async () => {
      const { tokens } = await service.login({ email: 'demo@test.com', password: 'Test1234!' });
      await service.logout(tokens.refreshToken);
      await expect(service.refresh(tokens.refreshToken)).rejects.toMatchObject({ statusCode: 401 });
    });
  });

  describe('getCurrentUser', () => {
    it('devuelve el usuario existente por id', async () => {
      const user = await service.getCurrentUser(1);
      expect(user.email).toBe('demo@test.com');
      expect(user.name).toBe('Demo User');
    });

    it('lanza 401 para un id inexistente', async () => {
      await expect(service.getCurrentUser(9999)).rejects.toMatchObject({ statusCode: 401 });
    });
  });
});