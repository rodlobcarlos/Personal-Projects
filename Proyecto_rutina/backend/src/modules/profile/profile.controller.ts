import { Request, Response } from 'express';
import { ProfileService } from './profile.service';
import { asyncHandler, ok } from '../../core/response';
import { UpdateProfileDto } from './profile.dto';

export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  get = asyncHandler(async (req: Request, res: Response) => {
    const profile = await this.service.getByUser(req.user!.id);
    return ok(res, { profile });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const profile = await this.service.update(req.user!.id, req.body as UpdateProfileDto);
    return ok(res, { profile });
  });
}