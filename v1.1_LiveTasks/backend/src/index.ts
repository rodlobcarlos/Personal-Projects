import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config';
import { connectDB } from './config/db';
import './config/passport';

import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import noteRoutes from './routes/noteRoutes';
import monitorRoutes from './routes/monitorRoutes';
import aiRoutes from './routes/aiRoutes';

const app: Application = express();

app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true,
  })
);

app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'LiveTasks API funcionando' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/monitor', monitorRoutes);
app.use('/api/ai', aiRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

const start = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`🚀 Backend LiveTasks corriendo en http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

start();
