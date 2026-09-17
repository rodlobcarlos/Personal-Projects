import { Router } from 'express';
import { TaskController } from './tasks.controller';
import { TaskService } from './tasks.service';
import { validateBody } from '../../middleware/validate';
import { CompleteTaskDto, CreateTaskDto, UpdateTaskDto } from './tasks.dto';

export const tasksRouter = Router();
const controller = new TaskController(new TaskService());

tasksRouter.get('/', controller.list);
tasksRouter.get('/:id', controller.getById);
tasksRouter.post('/', validateBody(CreateTaskDto), controller.create);
tasksRouter.put('/:id', validateBody(UpdateTaskDto), controller.update);
tasksRouter.delete('/:id', controller.remove);
tasksRouter.post('/:id/complete', validateBody(CompleteTaskDto), controller.complete);
tasksRouter.delete('/:id/completion', validateBody(CompleteTaskDto), controller.uncomplete);