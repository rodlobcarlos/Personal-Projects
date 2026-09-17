import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { validateBody } from '../../middleware/validate';
import { authLimiter } from '../../middleware/rate-limit';
import { authenticate } from '../../middleware/auth';
import { LoginDto, LogoutDto, RefreshDto, RegisterDto } from './auth.dto';

export const authRouter = Router();
const controller = new AuthController(new AuthService());

authRouter.post('/register', authLimiter, validateBody(RegisterDto), controller.register);
authRouter.post('/login', authLimiter, validateBody(LoginDto), controller.login);
authRouter.post('/refresh', authLimiter, validateBody(RefreshDto), controller.refresh);
authRouter.post('/logout', authLimiter, validateBody(LogoutDto), controller.logout);
authRouter.post('/logout-all', authLimiter, authenticate, controller.logoutAll);
authRouter.get('/me', authenticate, controller.me);