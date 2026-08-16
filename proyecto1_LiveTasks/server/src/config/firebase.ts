import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import admin from 'firebase-admin';
import { env } from './env.js';

const DEFAULT_SERVICE_ACCOUNT = fileURLToPath(new URL('../../serviceAccountKey.json', import.meta.url));
const serviceAccountPath = env.SERVICE_ACCOUNT_KEY_PATH ?? DEFAULT_SERVICE_ACCOUNT;

function createApp(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  if (!existsSync(serviceAccountPath)) {
    console.error(`No se encontró serviceAccountKey.json en: ${serviceAccountPath}`);
    process.exit(1);
  }

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
}

const app = createApp();

export default app;
