import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { config } from '../config/env';
import { logger } from '../config/logger';

/**
 * Ejecuta un archivo .sql contra la base de datos configurada.
 * Uso: npm run db:schema  o  npm run db:seed
 */
async function main(): Promise<void> {
  const file = process.argv[2];
  if (!file) {
    logger.error('Indica el archivo SQL: npm run db:schema | npm run db:seed');
    process.exit(1);
  }
  const filePath = path.resolve(process.cwd(), file);
  const sql = fs.readFileSync(filePath, 'utf8');

  const connection = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
    multipleStatements: true
  });

  await connection.query(sql);
  logger.info(`Archivo SQL ejecutado correctamente: ${filePath}`);
  await connection.end();
}

main().catch((error) => {
  logger.error('Error ejecutando SQL', { error: error instanceof Error ? error.message : error });
  process.exit(1);
});