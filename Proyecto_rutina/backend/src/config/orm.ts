import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from './env';
import { User } from '../entities/User';
import { RefreshToken } from '../entities/RefreshToken';
import { Habit } from '../entities/Habit';
import { Task } from '../entities/Task';
import { Completion } from '../entities/Completion';
import { TimeBlock } from '../entities/TimeBlock';
import { Category } from '../entities/Category';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  entities: [User, RefreshToken, Habit, Task, Completion, TimeBlock, Category],
  synchronize: config.db.synchronize,
  logging: config.db.logging,
  charset: 'utf8mb4',
  timezone: 'Z',
  extra: {
    connectionLimit: 10
  }
});

export async function initDataSource(): Promise<DataSource> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}