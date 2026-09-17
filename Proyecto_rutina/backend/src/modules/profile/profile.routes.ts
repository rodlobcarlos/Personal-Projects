import { Router } from 'express';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { validateBody } from '../../middleware/validate';
import { UpdateProfileDto } from './profile.dto';

export const profileRouter = Router();
const controller = new ProfileController(new ProfileService());

profileRouter.get('/', controller.get);
profileRouter.put('/', validateBody(UpdateProfileDto), controller.update);