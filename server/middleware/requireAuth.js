import { verifyWorkOSToken } from '../lib/verifyWorkOSToken.js';

/**
 * Require Authorization: Bearer <access_token>.
 * Sets req.auth = { sub, email, isAdmin }.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing or invalid authorization' });
  }

  const clientId = process.env.WORKOS_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  try {
    const payload = await verifyWorkOSToken(token, clientId);
    const sub = payload.sub;
    let rawEmail =
      payload.email ??
      payload.email_address ??
      payload.preferred_username ??
      payload.upn ??
      '';
    let email = rawEmail.toString().trim().toLowerCase();

    if (!email && sub && req.workos?.userManagement) {
      try {
        const user = await req.workos.userManagement.getUser(sub);
        email = (user?.email ?? '').toString().trim().toLowerCase();
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            '[auth] Email not in JWT and getUser failed:',
            e?.message,
            '— Add an "email" claim in WorkOS Dashboard → Authentication → Sessions → JWT Template (e.g. {"email": "{{ user.email }}"}).'
          );
        }
      }
    }

    const adminEmails = req.adminEmails || [];
    const isAdmin = adminEmails.length > 0 && email && adminEmails.includes(email);


    req.auth = { sub, email, isAdmin, payload };
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/** Require req.auth.isAdmin */
export function requireAdmin(req, res, next) {
  if (!req.auth) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  if (!req.auth.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
