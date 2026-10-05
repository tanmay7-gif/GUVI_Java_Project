import { Router } from 'express';
import {
  listPublicContent,
  listAllContentAdmin,
  createContent,
  moderateContent,
} from '../controllers/content.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import {
  createContentSchema,
  moderateContentSchema,
} from '../schemas/content.schema.js';

const router = Router();

// Publicly accessible approved content list
router.get('/', listPublicContent);

// User submission (requires auth)
router.post('/', authenticateToken, validateRequest(createContentSchema), createContent);

// Admin-only endpoints
router.get('/admin/all', authenticateToken, requireRole('ADMIN'), listAllContentAdmin);
router.patch('/admin/:id/moderate', authenticateToken, requireRole('ADMIN'), validateRequest(moderateContentSchema), moderateContent);

export default router;
