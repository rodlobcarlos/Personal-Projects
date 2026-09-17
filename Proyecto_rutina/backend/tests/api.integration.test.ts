import { DataSource } from 'typeorm';

let testDataSource: DataSource;
let app: unknown;

jest.mock('../src/config/orm', () => ({
  get AppDataSource(): DataSource {
    if (!testDataSource) {
      throw new Error('AppDataSource aún no está inicializado en el test');
    }
    return testDataSource;
  },
  initDataSource: jest.fn()
}));

const request = require('supertest');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createTestDataSource } = require('./helpers/test-db');

beforeAll(async () => {
  testDataSource = await createTestDataSource();
  // La app instancia los servicios al importarse: cargamos el módulo
  // con la BD ya inicializada para no ejecutar consultas contra undefined.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  app = require('../src/app').default;
});

afterAll(async () => {
  if (testDataSource?.isInitialized) {
    await testDataSource.destroy();
  }
});

describe('API e2e', () => {
  let accessToken = '';

  it('GET /health responde ok', async () => {
    const res = await request(app).get('/health').expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
  });

  it('GET /api-docs sirve Swagger UI', async () => {
    const res = await request(app).get('/api-docs/').expect(200);
    expect(res.type).toMatch(/html/);
  });

  it('registro → login → token de acceso', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'e2e@test.com', password: 'Clave1234!', name: 'E2E' })
      .expect(201);

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'e2e@test.com', password: 'Clave1234!' })
      .expect(200);

    expect(login.body.data.tokens.accessToken).toBeTruthy();
    accessToken = login.body.data.tokens.accessToken;
  });

  it('rechaza rutas protegidas sin token', async () => {
    const res = await request(app).get('/api/habits').expect(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('valida DTOs (422 con datos inválidos)', async () => {
    const res = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: '' })
      .expect(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('CRUD completo de hábito: crear, listar, completar, racha, stats', async () => {
    const auth = { Authorization: `Bearer ${accessToken}` };

    const created = await request(app)
      .post('/api/habits')
      .set(auth)
      .send({
        name: 'Ejercicio',
        frequency: 'daily',
        targetPerDay: 1,
        color: '#16A34A'
      })
      .expect(201);
    const habitId: number = created.body.data.habit.id;

    const list = await request(app).get('/api/habits').set(auth).expect(200);
    expect(list.body.data.habits.map((h: { id: number }) => h.id)).toContain(habitId);

    await request(app)
      .post(`/api/habits/${habitId}/complete`)
      .set(auth)
      .send({})
      .expect(201);

    const streak = await request(app).get(`/api/habits/${habitId}/streak`).set(auth).expect(200);
    expect(streak.body.data.current).toBeGreaterThanOrEqual(1);

    const stats = await request(app).get('/api/stats/summary?range=week').set(auth).expect(200);
    expect(stats.body.data.overview.activeHabits).toBeGreaterThanOrEqual(1);
    expect(stats.body.data.daily.length).toBeGreaterThan(0);
  });

  it('rechaza modificar un recurso ajeno (404) y responde 404 en rutas desconocidas', async () => {
    const auth = { Authorization: `Bearer ${accessToken}` };
    await request(app).put('/api/habits/99999').set(auth).send({ name: 'x' }).expect(404);
    await request(app).get('/api/no-existe').set(auth).expect(404);
  });
});