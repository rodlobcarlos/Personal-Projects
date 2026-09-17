import mysql from 'mysql2/promise';
import { config } from '../config/env';
import { logger } from '../config/logger';

async function main(): Promise<void> {
  const connection = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${config.db.name}\`
     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  logger.info(`Base de datos "${config.db.name}" creada (o ya existía).`);
  await connection.end();
}

main().catch((error) => {
  logger.error('No se pudo crear la base de datos', { error: error instanceof Error ? error.message : error });
  process.exit(1);
});