import { Router } from 'express';
import {
    startAssessment,
    getQuestions,
    submitAssessment,
    getAssessmentResults,
    claimAssessment
} from '../../controllers/public/assessment.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/start', startAssessment);
router.get('/questions', getQuestions);
router.post('/:id/submit', submitAssessment);
router.get('/:id/results', getAssessmentResults);
router.post('/:id/claim', authenticate, claimAssessment);

export default router;
