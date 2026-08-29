import { Router } from 'express';
import passport from 'passport';
import {
  register,
  login,
  googleAuth,
  getMe,
  updateProfile,
  refreshToken,
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router: Router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleAuth
);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
