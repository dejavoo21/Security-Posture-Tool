import { Router } from 'express';
import { generatePdfReport } from '../../controllers/workspace/pdf.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/:id/pdf', authenticate, generatePdfReport);

export default router;
