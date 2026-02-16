# Frontend

React single-page application built with Vite and Tailwind CSS. Serves the public portfolio and an authenticated admin dashboard.

## Pages

- **Public**: Home, About, Education, Experience, Projects, Gallery, Awards, Contact
- **Admin** (`/admin`): Content editing, image uploads, gallery management, contact form inbox, admin email management. Requires WorkOS sign-in and an email listed in the `admin_emails` table.
- **Full Gallery** (`/gallery`): Expanded gallery view with carousel and category filtering.

## Key directories

```
src/
  components/        # Page components (Home.jsx, About.jsx, etc.)
  components/admin/  # Admin dashboard section editors
  services/          # Supabase client and portfolio data service
  hooks/             # Custom React hooks
  features/          # Feature modules (translation)
  utils/             # Helpers
  assets/            # Static images and icons
```

## Data flow

- Portfolio content is fetched from Supabase using the **anon key** (read-only, enforced by RLS).
- Contact form submissions go through `POST /api/contact` on the Express backend (rate-limited).
- Admin operations (content edits, uploads, email management) go through authenticated `/api/admin/*` endpoints on the backend.
- EmailJS sends a notification email to the site owner on each contact submission (client-side).

## Environment variables

Create `.env.local`:

```
VITE_SUPABASE_URL=<supabase project url>
VITE_SUPABASE_ANON_KEY=<supabase anon key>
VITE_API_BASE_URL=http://localhost:3001
VITE_WORKOS_CLIENT_ID=<workos client id>
VITE_EMAILJS_PUBLIC_KEY=<emailjs public key>
VITE_EMAILJS_SERVICE_ID=<emailjs service id>
VITE_EMAILJS_TEMPLATE_ID=<emailjs template id>
VITE_GOOGLE_TRANSLATE_API_KEY=<google translate api key>  # optional, translation currently disabled
```

## Run

```bash
npm install
npm run dev
```

Starts on port 3000. Or run both frontend and server together from the project root with `npm run dev`.
