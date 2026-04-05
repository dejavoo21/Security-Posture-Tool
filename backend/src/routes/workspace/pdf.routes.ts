import { Router } from 'express';
import { generatePdfReport } from '../../controllers/workspace/pdf.controller.js';

const router = Router();

router.get('/:id/pdf', generatePdfReport);

export default router;
