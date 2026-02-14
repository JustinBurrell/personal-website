import { createLocalJWKSet, jwtVerify } from 'jose';

const WORKOS_BASE_URL = process.env.WORKOS_API_HOSTNAME
  ? `https://${process.env.WORKOS_API_HOSTNAME}`
  : 'https://api.workos.com';
const jwksByClientId = new Map();

async function fetchJwks(clientId) {
  const url = `${WORKOS_BASE_URL}/sso/jwks/${clientId}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    redirect: 'follow',
  });
  if (!res.ok) {
    throw new Error(`WorkOS JWKS returned ${res.status} ${res.statusText} from ${url}`);
  }
  const body = await res.json();
  if (!body || !Array.isArray(body.keys)) {
    throw new Error('Invalid WorkOS JWKS response');
  }
  return createLocalJWKSet(body);
}

function getJwks(clientId) {
  if (!jwksByClientId.has(clientId)) {
    jwksByClientId.set(clientId, fetchJwks(clientId));
  }
  return jwksByClientId.get(clientId);
}

/**
 * Verify WorkOS AuthKit access token (JWT) and return payload.
 * Uses the same JWKS URL as @workos-inc/node: /sso/jwks/{clientId}.
 * @param {string} token - Bearer token (JWT)
 * @param {string} clientId - WorkOS client ID (audience, required for JWKS URL)
 * @returns {Promise<{ sub: string, email?: string, [key: string]: unknown }>}
 */
export async function verifyWorkOSToken(token, clientId) {
  const jwksSet = await getJwks(clientId);
  const { payload } = await jwtVerify(token, jwksSet);
  return payload;
}
