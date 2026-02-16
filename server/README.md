# Server

Express API that handles authentication, admin content management, file uploads, and contact form submissions. Uses the Supabase **service role key** for database access (bypasses RLS).

## Routes

| Route | Description |
|-------|-------------|
| `GET /api/health` | Health check |
| `GET /api/auth/me` | Returns authenticated user info and admin status |
| `POST /api/contact` | Public contact form submission (rate-limited: 5/IP/15min) |
| `PATCH /api/admin/sections/:section` | Update a section's main row |
| `PATCH /api/admin/sections/:section/rows/:id` | Update a specific row |
| `GET/POST/PATCH/DELETE /api/admin/sections/:section/items` | CRUD for child items (skills, positions, etc.) |
| `GET/POST/PATCH/DELETE /api/admin/sections/gallery/rows` | Gallery row management |
| `GET/POST/DELETE /api/admin/sections/:section/nested/...` | Nested items (categories, positions) |
| `POST /api/admin/upload` | File upload (images/PDF, 10MB max, MIME validated) |
| `GET/POST/DELETE /api/admin/admin-emails` | Manage admin email addresses |

All `/api/admin/*` routes require an authenticated admin (Bearer token + email in `admin_emails` table).

## Key directories

```
server/
  index.js           # App entry, middleware setup (helmet, CORS, JSON)
  routes/
    auth.js           # WorkOS token verification, admin check
    admin.js          # All admin CRUD and upload endpoints
    contact.js        # Rate-limited contact form endpoint
  middleware/
    requireAuth.js    # JWT verification and admin gate
  lib/
    sectionConfig.js  # Table/column mappings per portfolio section
    supabaseAdmin.js  # Supabase service role client
    verifyWorkOSToken.js  # WorkOS JWKS token verification
```

## Security

- **Helmet** for HTTP security headers
- **Rate limiting** on public contact endpoint
- **MIME type validation** on uploads (jpeg, png, webp, gif, pdf only)
- **Generic error messages** in production (full details logged server-side)
- **CORS** restricted to configured origins

## Environment variables

Create `.env`:

```
PORT=3001
WORKOS_API_KEY=<workos secret key (sk_...)>
WORKOS_CLIENT_ID=<workos client id>
SUPABASE_URL=<supabase project url>
SUPABASE_SERVICE_ROLE_KEY=<supabase service role key>
FRONTEND_ORIGIN=http://localhost:3000
NODE_ENV=development
```

For production, set `FRONTEND_ORIGIN` to your deployed frontend URL (comma-separated for multiple origins).

## Run

```bash
npm install
npm run dev
```

Starts on port 3001 (default). Or run both frontend and server from the project root with `npm run dev`.

## WorkOS setup

1. In the [WorkOS Dashboard](https://dashboard.workos.com), add your app origins (local and production) under:
   - **Redirects**: Add redirect URIs (no trailing slash)
   - **Authentication > Sessions > CORS**: Add allowed web origins
   - **Redirects**: Set sign-out redirect to your app origin
2. Add a JWT template claim for `email`: value `{{ user.email }}` so the admin check works without extra API calls.
3. Use the **Secret** API key (starts with `sk_`) from the same WorkOS environment as your Client ID.

## Troubleshooting

- **CORS error with `api.workos.com`**: Add your app origin to WorkOS CORS settings (Authentication > Sessions > CORS).
- **"Token verification failed"**: Server fetches JWKS from `https://api.workos.com/sso/jwks/{clientId}`. Verify your Client ID is correct.
- **Admin button not showing**: Ensure the JWT template includes the `email` claim, and the email matches an entry in the `admin_emails` table.
