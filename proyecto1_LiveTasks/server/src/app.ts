import cors from 'cors';
import express from 'express';
import healthRouter from './routes/health.js';
import tasksRouter from './routes/tasks.js';

export function createApp(): express.Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', healthRouter);
  app.use('/api', tasksRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'NOT_FOUND' });
  });

  return app;
}
