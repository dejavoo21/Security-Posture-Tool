import { Router } from 'express';
import { listFrameworkPacks, updateFrameworkPackStatus, seedFrameworkPacks } from '../../controllers/admin/framework.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, listFrameworkPacks);
router.put('/:id', authenticate, requireRole(['SUPER_ADMIN']), updateFrameworkPackStatus);
router.post('/seed', authenticate, requireRole(['SUPER_ADMIN']), seedFrameworkPacks);

export default router;
