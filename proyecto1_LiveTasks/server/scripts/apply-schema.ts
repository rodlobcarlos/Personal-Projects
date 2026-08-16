import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const schemaPath = fileURLToPath(new URL('../schema.sql', import.meta.url));

const connection = await mysql.createConnection({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
});

const sql = await readFile(schemaPath, 'utf8');

try {
  await connection.query(sql);
  console.log('Esquema aplicado correctamente en MySQL.');
} catch (error) {
  console.error('Error al aplicar el esquema:', error);
  process.exitCode = 1;
} finally {
  await connection.end();
}
