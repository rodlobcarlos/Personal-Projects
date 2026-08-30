import cors from 'cors';
import express from 'express';
import healthRouter from './routes/health.js';
import tasksRouter from './routes/tasks.js';
import notesRouter from './routes/notes.js';
import aiRouter from './routes/ai.js';
import pushRouter from './routes/push.js';

export function createApp(): express.Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', healthRouter);
  app.use('/api', tasksRouter);
  app.use('/api', notesRouter);
  app.use('/api', aiRouter);
  app.use('/api', pushRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'NOT_FOUND' });
  });

  return app;
}
