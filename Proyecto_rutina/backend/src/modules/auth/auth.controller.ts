import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { asyncHandler, created, noContent, ok } from '../../core/response';
import { LoginDto, LogoutDto, RefreshDto, RegisterDto } from './auth.dto';

export class AuthController {
  constructor(private readonly service: AuthService) {}

  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.register(req.body as RegisterDto);
    return created(res, result);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.login(req.body as LoginDto);
    return ok(res, result);
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const tokens = await this.service.refresh((req.body as RefreshDto).refreshToken);
    return ok(res, tokens);
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    await this.service.logout((req.body as LogoutDto).refreshToken);
    return noContent(res);
  });

  logoutAll = asyncHandler(async (req: Request, res: Response) => {
    await this.service.logoutAll(req.user!.id);
    return noContent(res);
  });

  me = asyncHandler(async (_req: Request, res: Response) => {
    const user = await this.service.getCurrentUser(_req.user!.id);
    return ok(res, { user });
  });
}