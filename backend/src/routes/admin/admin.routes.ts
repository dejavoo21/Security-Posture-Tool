import { Router } from 'express';
import {
    getAllQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion
} from '../../controllers/admin/admin.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.use(requireRole(['SUPER_ADMIN']));

router.get('/questions', getAllQuestions);
router.post('/questions', addQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

export default router;
