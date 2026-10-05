import { Router } from 'express';
import {
  listChallenges,
  joinChallenge,
  getMyChallenges,
  createChallenge,
} from '../controllers/challenge.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { createChallengeSchema } from '../schemas/challenge.schema.js';

const router = Router();

// Allow reading challenges (optional auth to see personal progress)
router.get('/', (req, res, next) => {
  // If token is present, decode it, otherwise proceed as guest
  const authHeader = req.headers.authorization;
  if (authHeader) {
    return authenticateToken(req as any, res, next);
  }
  next();
}, listChallenges);

// User challenge actions
router.post('/:challengeId/join', authenticateToken, joinChallenge);
router.get('/my/progress', authenticateToken, getMyChallenges);

// Admin-only creation
router.post('/admin/create', authenticateToken, requireRole('ADMIN'), validateRequest(createChallengeSchema), createChallenge);

export default router;
