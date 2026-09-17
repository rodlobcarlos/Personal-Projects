import { DataSource } from 'typeorm';
import { User } from '../../src/entities/User';
import { RefreshToken } from '../../src/entities/RefreshToken';
import { Habit } from '../../src/entities/Habit';
import { Task } from '../../src/entities/Task';
import { Completion } from '../../src/entities/Completion';
import { TimeBlock } from '../../src/entities/TimeBlock';
import { Category } from '../../src/entities/Category';

const entities = [User, RefreshToken, Habit, Task, Completion, TimeBlock, Category];

/**
 * Crea una DataSource SQLite en memoria con el mismo esquema TypeORM.
 * Perfecta para tests: arranca limpia en cada bloque y no requiere MySQL.
 */
export async function createTestDataSource(): Promise<DataSource> {
  const ds = new DataSource({
    type: 'better-sqlite3',
    database: ':memory:',
    entities,
    synchronize: true
  });
  await ds.initialize();
  return ds;
}

/**
 * Inserta un usuario demo en la BD de test y devuelve su id.
 */
export async function seedDemoUser(ds: DataSource): Promise<number> {
  const bcrypt = require('bcrypt') as typeof import('bcrypt');
  const hash = await bcrypt.hash('Test1234!', 10);
  const repo = ds.getRepository(User);
  const user = await repo.save(
    repo.create({
      email: 'demo@test.com',
      passwordHash: hash,
      name: 'Demo User',
      timezone: 'America/Mexico_City',
      theme: 'system',
      preferences: {}
    })
  );
  return user.id;
}