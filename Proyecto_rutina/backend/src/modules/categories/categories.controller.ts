import { Request, Response } from 'express';
import { CategoryService } from './categories.service';
import { asyncHandler, created, noContent, ok } from '../../core/response';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  list = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await this.service.list(_req.user!.id);
    return ok(res, { categories });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const category = await this.service.getById(req.user!.id, Number(req.params.id));
    return ok(res, { category });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const category = await this.service.create(req.user!.id, req.body as CreateCategoryDto);
    return created(res, { category });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const category = await this.service.update(req.user!.id, Number(req.params.id), req.body as UpdateCategoryDto);
    return ok(res, { category });
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await this.service.remove(req.user!.id, Number(req.params.id));
    return noContent(res);
  });
}