import { Router } from 'express';
import { createNote, getNotes } from '../../controllers/workspace/note.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticate, createNote);
router.get('/', authenticate, getNotes);

export default router;
