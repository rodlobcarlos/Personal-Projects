import { Router } from 'express';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

export const statsRouter = Router();
const controller = new StatsController(new StatsService());

statsRouter.get('/summary', controller.summary);
statsRouter.get('/streaks', controller.streaks);