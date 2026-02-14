const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function getAccessToken() {
  // AuthKit stores the session; we need the access token to call our API.
  // The AuthProvider will pass getAccessToken from useAuth().
  return window.__authKitGetAccessToken?.() ?? null;
}

/**
 * Call GET /api/auth/me with the current WorkOS access token.
 * @param {() => Promise<string|null>} getAccessTokenFn - from useAuth().getAccessToken
 * @returns {Promise<{ user: { id, email }, isAdmin: boolean } | null>}
 */
export async function fetchAuthMe(getAccessTokenFn) {
  if (!getAccessTokenFn) return null;
  const token = await getAccessTokenFn();
  if (!token) return null;
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });
  if (!res.ok) return null;
  return res.json();
}
