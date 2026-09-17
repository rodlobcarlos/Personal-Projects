import { Request, Response } from 'express';
import { StatsService, SummaryQuery } from './stats.service';
import { asyncHandler, ok } from '../../core/response';

export class StatsController {
  constructor(private readonly service: StatsService) {}

  summary = asyncHandler(async (req: Request, res: Response) => {
    const query: SummaryQuery = {};
    if (req.query.range === 'week' || req.query.range === 'month') {
      query.range = req.query.range;
    }
    if (typeof req.query.from === 'string') query.from = req.query.from;
    if (typeof req.query.to === 'string') query.to = req.query.to;
    const summary = await this.service.summary(req.user!.id, query, req.user!.timezone);
    return ok(res, summary);
  });

  streaks = asyncHandler(async (req: Request, res: Response) => {
    const streaks = await this.service.streaks(req.user!.id, req.user!.timezone);
    return ok(res, { streaks });
  });
}