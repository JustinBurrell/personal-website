import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';

export const authRouter = Router();

/**
 * GET /api/auth/me
 * Requires Authorization: Bearer <WorkOS access token>
 * Returns { user: { id, email }, isAdmin }
 */
authRouter.get('/me', requireAuth, (req, res) => {
  const { sub, email, isAdmin, payload } = req.auth;
  res.json({
    user: {
      id: sub,
      email: email || payload.email || null,
      firstName: payload.first_name ?? payload.given_name ?? null,
      lastName: payload.last_name ?? payload.family_name ?? null,
    },
    isAdmin,
  });
});
