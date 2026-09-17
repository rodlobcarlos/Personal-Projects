import { Router } from 'express';
import { TimeBlockController } from './timeblocks.controller';
import { TimeBlockService } from './timeblocks.service';
import { validateBody } from '../../middleware/validate';
import { CreateTimeBlockDto, UpdateTimeBlockDto } from './timeblocks.dto';

export const timeBlocksRouter = Router();
const controller = new TimeBlockController(new TimeBlockService());

timeBlocksRouter.get('/', controller.list);
timeBlocksRouter.get('/:id', controller.getById);
timeBlocksRouter.post('/', validateBody(CreateTimeBlockDto), controller.create);
timeBlocksRouter.put('/:id', validateBody(UpdateTimeBlockDto), controller.update);
timeBlocksRouter.delete('/:id', controller.remove);