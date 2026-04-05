import { Router } from 'express';
import {
    startAssessment,
    getQuestions,
    submitAssessment,
    getAssessmentResults
} from '../../controllers/public/assessment.controller.js';

const router = Router();

router.post('/start', startAssessment);
router.get('/questions', getQuestions);
router.post('/:id/submit', submitAssessment);
router.get('/:id/results', getAssessmentResults);

export default router;
