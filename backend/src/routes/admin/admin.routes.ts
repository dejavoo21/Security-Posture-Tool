import { Router } from 'express';
import {
    getAllQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion
} from '../../controllers/admin/admin.controller.js';

const router = Router();

router.get('/questions', getAllQuestions);
router.post('/questions', addQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

export default router;
