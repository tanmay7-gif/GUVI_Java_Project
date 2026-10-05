import { Router } from 'express';
import {
  getDashboardKPIs,
  listUsers,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  getSystemSettings,
  updateSystemSetting,
  getAuditLogs,
} from '../controllers/admin.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import {
  createUserAdminSchema,
  updateUserSchema,
  updateSettingSchema,
} from '../schemas/admin.schema.js';

const router = Router();

// All admin routes strictly enforce authenticateToken + requireRole('ADMIN')
router.use(authenticateToken);
router.use(requireRole('ADMIN'));

router.get('/dashboard', getDashboardKPIs);

// User Management
router.get('/users', listUsers);
router.post('/users', validateRequest(createUserAdminSchema), createUserByAdmin);
router.patch('/users/:id', validateRequest(updateUserSchema), updateUserByAdmin);
router.delete('/users/:id', deleteUserByAdmin);

// System Settings
router.get('/settings', getSystemSettings);
router.put('/settings/:key', validateRequest(updateSettingSchema), updateSystemSetting);

// Audit Logs
router.get('/audit-logs', getAuditLogs);

export default router;
