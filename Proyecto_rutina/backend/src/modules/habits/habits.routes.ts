import { Router } from 'express';
import { HabitController } from './habits.controller';
import { HabitService } from './habits.service';
import { validateBody } from '../../middleware/validate';
import { CompleteHabitDto, CreateHabitDto, UncompleteHabitDto, UpdateHabitDto } from './habits.dto';

export const habitsRouter = Router();
const controller = new HabitController(new HabitService());

habitsRouter.get('/', controller.list);
habitsRouter.get('/:id', controller.getById);
habitsRouter.post('/', validateBody(CreateHabitDto), controller.create);
habitsRouter.put('/:id', validateBody(UpdateHabitDto), controller.update);
habitsRouter.delete('/:id', controller.remove);
habitsRouter.post('/:id/complete', validateBody(CompleteHabitDto), controller.complete);
habitsRouter.delete('/:id/completion', validateBody(UncompleteHabitDto), controller.uncomplete);
habitsRouter.get('/:id/streak', controller.streak);