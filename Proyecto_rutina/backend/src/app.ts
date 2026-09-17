import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env';
import { httpLogStream } from './config/logger';
import openapiSpec from './docs/openapi.json';
import { authRouter } from './modules/auth/auth.routes';
import { habitsRouter } from './modules/habits/habits.routes';
import { tasksRouter } from './modules/tasks/tasks.routes';
import { timeBlocksRouter } from './modules/timeblocks/timeblocks.routes';
import { categoriesRouter } from './modules/categories/categories.routes';
import { profileRouter } from './modules/profile/profile.routes';
import { statsRouter } from './modules/stats/stats.routes';
import { authenticate } from './middleware/auth';
import { apiLimiter } from './middleware/rate-limit';
import { errorHandler, routeNotFound } from './middleware/error-handler';

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined', { stream: httpLogStream }));

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', env: config.env, timestamp: new Date().toISOString() } });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, { customSiteTitle: 'Rutina API - Documentación' }));

app.use('/api', apiLimiter);
app.use('/api/auth', authRouter);

app.use('/api/habits', authenticate, habitsRouter);
app.use('/api/tasks', authenticate, tasksRouter);
app.use('/api/time-blocks', authenticate, timeBlocksRouter);
app.use('/api/categories', authenticate, categoriesRouter);
app.use('/api/profile', authenticate, profileRouter);
app.use('/api/stats', authenticate, statsRouter);

app.use(routeNotFound);
app.use(errorHandler);

export default app;