import { Router } from 'express';
import { getConsultantQueue, assignConsultant, getConsultantOrganizations } from '../../controllers/admin/consultant.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/queue', authenticate, requireRole(['SUPER_ADMIN', 'CONSULTANT']), getConsultantQueue);
router.get('/organizations', authenticate, requireRole(['SUPER_ADMIN', 'CONSULTANT']), getConsultantOrganizations);
router.put('/organizations/:organizationId/assign', authenticate, requireRole(['SUPER_ADMIN']), assignConsultant);

export default router;
