import { Request, Response } from 'express';
import { HabitService } from './habits.service';
import { asyncHandler, created, noContent, ok } from '../../core/response';
import { CompleteHabitDto, CreateHabitDto, UpdateHabitDto } from './habits.dto';

export class HabitController {
  constructor(private readonly service: HabitService) {}

  list = asyncHandler(async (req: Request, res: Response) => {
    const habits = await this.service.list(req.user!.id);
    return ok(res, { habits });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const habit = await this.service.getById(req.user!.id, Number(req.params.id));
    return ok(res, { habit });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const habit = await this.service.create(req.user!.id, req.body as CreateHabitDto);
    return created(res, { habit });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const habit = await this.service.update(req.user!.id, Number(req.params.id), req.body as UpdateHabitDto);
    return ok(res, { habit });
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await this.service.remove(req.user!.id, Number(req.params.id));
    return noContent(res);
  });

  complete = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as CompleteHabitDto;
    const completion = await this.service.complete(
      req.user!.id,
      Number(req.params.id),
      body.completionDate,
      body.note,
      req.user!.timezone
    );
    return created(res, { completion });
  });

  uncomplete = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as CompleteHabitDto;
    await this.service.uncomplete(req.user!.id, Number(req.params.id), body.completionDate, req.user!.timezone);
    return noContent(res);
  });

  streak = asyncHandler(async (req: Request, res: Response) => {
    const streak = await this.service.streak(req.user!.id, Number(req.params.id), req.user!.timezone);
    return ok(res, streak);
  });
}