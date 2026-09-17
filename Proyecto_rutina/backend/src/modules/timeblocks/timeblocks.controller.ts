import { Request, Response } from 'express';
import { TimeBlockService } from './timeblocks.service';
import { asyncHandler, created, noContent, ok } from '../../core/response';
import { CreateTimeBlockDto, UpdateTimeBlockDto } from './timeblocks.dto';

export class TimeBlockController {
  constructor(private readonly service: TimeBlockService) {}

  list = asyncHandler(async (req: Request, res: Response) => {
    const from = typeof req.query.from === 'string' ? req.query.from : undefined;
    const to = typeof req.query.to === 'string' ? req.query.to : undefined;
    const blocks = await this.service.list(req.user!.id, from, to);
    return ok(res, { blocks });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const block = await this.service.getById(req.user!.id, Number(req.params.id));
    return ok(res, { block });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const block = await this.service.create(req.user!.id, req.body as CreateTimeBlockDto);
    return created(res, { block });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const block = await this.service.update(req.user!.id, Number(req.params.id), req.body as UpdateTimeBlockDto);
    return ok(res, { block });
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await this.service.remove(req.user!.id, Number(req.params.id));
    return noContent(res);
  });
}