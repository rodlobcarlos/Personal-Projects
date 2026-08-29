import { Router } from 'express';
import { getStats } from '../controllers/monitorController';
import { protect } from '../middleware/auth';

const router: Router = Router();

router.get('/stats', protect, getStats);

export default router;
