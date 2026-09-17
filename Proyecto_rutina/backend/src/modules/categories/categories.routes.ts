import { Router } from 'express';
import { CategoryController } from './categories.controller';
import { CategoryService } from './categories.service';
import { validateBody } from '../../middleware/validate';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

export const categoriesRouter = Router();
const controller = new CategoryController(new CategoryService());

categoriesRouter.get('/', controller.list);
categoriesRouter.get('/:id', controller.getById);
categoriesRouter.post('/', validateBody(CreateCategoryDto), controller.create);
categoriesRouter.put('/:id', validateBody(UpdateCategoryDto), controller.update);
categoriesRouter.delete('/:id', controller.remove);