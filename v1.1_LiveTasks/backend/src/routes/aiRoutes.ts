import { Router } from 'express';
import { taskSuggestion, daySummary } from '../controllers/aiController';
import { protect } from '../middleware/auth';

const router: Router = Router();

router.post('/task-suggestion', protect, taskSuggestion);
router.post('/day-summary', protect, daySummary);

export default router;
