import { Request, Response } from 'express';
import { TaskService } from './tasks.service';
import { asyncHandler, created, noContent, ok } from '../../core/response';
import { CompleteTaskDto, CreateTaskDto, TaskListQueryDto, UpdateTaskDto } from './tasks.dto';

export class TaskController {
  constructor(private readonly service: TaskService) {}

  list = asyncHandler(async (req: Request, res: Response) => {
    const tasks = await this.service.list(req.user!.id, req.query as unknown as TaskListQueryDto);
    return ok(res, { tasks });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const task = await this.service.getById(req.user!.id, Number(req.params.id));
    return ok(res, { task });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const task = await this.service.create(req.user!.id, req.body as CreateTaskDto);
    return created(res, { task });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const task = await this.service.update(req.user!.id, Number(req.params.id), req.body as UpdateTaskDto);
    return ok(res, { task });
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await this.service.remove(req.user!.id, Number(req.params.id));
    return noContent(res);
  });

  complete = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as CompleteTaskDto;
    const task = await this.service.complete(req.user!.id, Number(req.params.id), body.completionDate, req.user!.timezone);
    return ok(res, { task });
  });

  uncomplete = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as CompleteTaskDto;
    const task = await this.service.uncomplete(req.user!.id, Number(req.params.id), body.completionDate, req.user!.timezone);
    return ok(res, { task });
  });
}