# Personal website API (auth + admin)

Runs the WorkOS auth verification and admin content/upload API.

## Run everything (frontend + API) from repo root

From the **project root** (not `server/` or `frontend/`):

```bash
npm run dev
```

This starts the API on port 3001 and the frontend on port 3000.

## Setup

1. Copy `.env.example` to `.env` and fill in:
   - **WORKOS_API_KEY** and **WORKOS_CLIENT_ID** from [WorkOS Dashboard](https://dashboard.workos.com) (Authentication → API Keys).
   - **SUPABASE_URL** and **SUPABASE_SERVICE_ROLE_KEY** from your Supabase project (Settings → API). Use the **service role** key here only; never expose it to the frontend.
   - **ADMIN_EMAILS**: comma-separated list of emails allowed to access admin (e.g. `you@example.com`).
   - **FRONTEND_ORIGIN**: one origin or comma-separated list for CORS (e.g. `http://localhost:3000` for local only, or `http://localhost:3000,https://my-site.vercel.app` for local + Vercel).

2. **WorkOS Dashboard** (so sign-in redirects back and the browser allows API requests):
   - **Redirect URI**: Go to [**Redirects**](https://dashboard.workos.com/redirects). Add both (no trailing slash):
     - `http://localhost:3000` (local)
     - `https://<your-vercel-app-domain>` (production; e.g. `https://my-site.vercel.app`)
   - **CORS**: In the dashboard go to **Authentication** → **Sessions** (or **Configuration**), find the **CORS** section, click **Manage**, and add both:
     - `http://localhost:3000`
     - `https://<your-vercel-app-domain>` (no trailing slash)
   - **Sign-out redirect**: On the same [**Redirects**](https://dashboard.workos.com/redirects) page, set the default **Sign-out redirect** to your app origin (e.g. `http://localhost:3000` for local, and add production URL). Otherwise after Sign out you may see a WorkOS error page instead of returning to your app.
   - Optionally enable OAuth providers under **Authentication** → OAuth providers.

3. In `server/.env`, set **ADMIN_EMAILS** to your real email (comma-separated if multiple). Only those addresses can see the Admin link and use the dashboard.

### Expected sign-in flow

1. Click **Sign in** → redirects to WorkOS (Google or other provider).
2. After login, WorkOS redirects back to your app with a code; the AuthKit SDK exchanges it with `api.workos.com` (this request **must** be allowed by WorkOS CORS).
3. App state updates; navbar shows **Admin** (if your email is in `ADMIN_EMAILS`) and **Sign out**.

If you see a CORS error mentioning `api.workos.com/user_management/authenticate` and “nothing happens” after logging in, add your app origin to WorkOS CORS (see step 2 above). Without it, the browser blocks the token exchange.

### Troubleshooting: “Sign in does nothing” / CORS with api.workos.com

- Go to [WorkOS Dashboard](https://dashboard.workos.com) → **Authentication** → **Sessions**.
- Find **Cross-Origin Resource Sharing (CORS)** and click **Manage** (or **Configure CORS**).
- Add **exactly** `http://localhost:3000` (no trailing slash) as an allowed web origin, then **Save**.
- Try sign-in again.

### Troubleshooting: "Token verification failed" / JWKS 404

- The server fetches WorkOS public keys from `https://api.workos.com/sso/jwks/{clientId}` (the client ID is required in the path). If you use a custom API host, set `WORKOS_API_HOSTNAME` in `.env`.
- After verification works, the **Admin** link only appears when the signed-in user’s email (from the token) matches **ADMIN_EMAILS** in `server/.env`. Use the exact Google account email in that list.

### Troubleshooting: Admin button not showing / "Could not fetch user by sub"

- The server needs the signed-in user’s **email** to compare with **ADMIN_EMAILS**. By default the WorkOS session JWT may not include `email`.
- **Recommended:** Add the email claim to your JWT in the WorkOS Dashboard so the token includes it and the Admin check works without any extra API call:
  1. Go to [WorkOS Dashboard](https://dashboard.workos.com) → **Authentication** → **Sessions**.
  2. Find **JWT Template** (or **Configure JWT Template**) and add a claim: name **`email`**, value **`{{ user.email }}`** (or use the template editor to add `"email": "{{ user.email }}"`).
  3. Save. Sign out and sign in again so a new token is issued with the email claim.
- **API key:** Use the **Secret** API key (starts with `sk_`) in `WORKOS_API_KEY`, from the same WorkOS environment (e.g. Staging) as your Client ID. If you see "Could not authorize the request" when the server tries to fetch the user, the JWT template approach above avoids that call entirely.

## Run

```bash
npm install
npm run dev
```

Server listens on `PORT` (default 3001). Point the frontend `VITE_API_BASE_URL` to this (e.g. `http://localhost:3001` locally; in production set it to your deployed API URL).

**Production (e.g. Vercel):** Deploy the server and set env: `FRONTEND_ORIGIN` to your frontend URL (or comma-separated list if the same API serves both local and production). In the frontend project, set `VITE_API_BASE_URL` to the deployed API base URL. The app already uses `window.location.origin` for the WorkOS redirect, so the same build works for local and production as long as both redirect URI and CORS are configured in WorkOS for each origin.

## Endpoints

- `GET /api/health` – health check
- `GET /api/auth/me` – requires `Authorization: Bearer <WorkOS access token>`, returns `{ user, isAdmin }`
- `PATCH /api/admin/sections/:section` – update first main row for section (body: partial camelCase row)
- `PATCH /api/admin/sections/:section/rows/:id` – update a specific main row (e.g. education, gallery)
- `GET /api/admin/sections/:section/items?itemType=&parentId=` – list child items (itemType: about=skills|interests, experience=professional|leadership, etc.)
- `POST /api/admin/sections/:section/items` – create child item (body: itemType, fields; education_id for education)
- `PATCH /api/admin/sections/:section/items/:id` – update child item
- `DELETE /api/admin/sections/:section/items/:id?itemType=` – delete child item
- `GET/POST/PATCH/DELETE /api/admin/sections/gallery/rows` – gallery rows (each row is one gallery item)
- `GET/POST/DELETE /api/admin/sections/:section/nested/:parentTable/:parentId/:nestedType` – nested items (e.g. gallery categories, experience positions)
- `POST /api/admin/upload` – multipart: `file`, `section`, optional `path`; returns `{ path, url }`

All `/api/admin/*` routes require an authenticated admin (Bearer token + email in ADMIN_EMAILS).

## Supabase security

- The frontend uses the **anon** key and should only have **read** access to portfolio tables.
- This API uses the **service role** key for admin writes and uploads. Keep the service role key only in this server’s environment (never in the frontend or in client-side env).
- Recommended: enable Row Level Security (RLS) on your Supabase tables and grant `SELECT` for anon; do not grant anon `INSERT`/`UPDATE`/`DELETE`. All content changes should go through this API.
