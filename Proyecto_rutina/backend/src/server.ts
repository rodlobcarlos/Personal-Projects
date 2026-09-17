import app from './app';
import { config } from './config/env';
import { logger } from './config/logger';
import { initDataSource } from './config/orm';

async function bootstrap(): Promise<void> {
  await initDataSource();
  logger.info('Conexión a MySQL establecida');

  const server = app.listen(config.port, () => {
    logger.info(`API de Rutina escuchando en http://localhost:${config.port} (${config.env})`);
    logger.info(`Documentación Swagger: http://localhost:${config.port}/api-docs`);
  });

  const shutdown = (signal: string) => {
    logger.info(`Recibido ${signal}, cerrando servidor...`);
    server.close(() => {
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((error) => {
  logger.error('No se pudo iniciar el servidor', { error });
  process.exit(1);
});