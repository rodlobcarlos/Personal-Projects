import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DB_HOST: z.string().min(1).default('127.0.0.1'),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
  GEMINI_API_KEY: z.string().optional(),
  SERVICE_ACCOUNT_KEY_PATH: z.string().optional(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('Configuración de entorno inválida:', result.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = result.data;
