# Justin Burrell | Software Engineer Portfolio

A portfolio site built with React and Supabase: dynamic content, contact form, and an admin area for editing content and managing contact submissions.

## Stack

| Category      | Technology     |
|--------------|----------------|
| Frontend     | React, Tailwind CSS |
| Backend/API  | Node.js (Express)    |
| Database     | Supabase (PostgreSQL) |
| Auth         | WorkOS, Supabase Auth |
| Storage      | Supabase Storage    |
| Contact form| EmailJS → Supabase  |
| Routing      | React Router        |

## Features

- **Sections**: Home, About, Education, Experience, Projects, Gallery, Awards, Contact.
- **Dynamic content**: Copy, images, and structure are driven by Supabase. Update content via the admin without code changes.
- **Contact form**: Submissions go through EmailJS and are stored in Supabase; admins can view and delete them.
- **Admin**: Authenticated admins can edit section content (text, images, items), manage gallery rows, and view/delete contact-form emails. Reach it at `/admin` (sign-in required).
- **Translation**: Multi-language (e.g. English/Spanish) was supported via Google Cloud translation; it’s currently disabled due to Google Console credits. The language/translate code remains in the repo for when credits are available again.

## Project structure

```
personal-website/
├── frontend/          # React app (Vite)
├── server/            # Express API (admin routes, auth proxy)
├── supabase/          # Schema, migrations
└── README.md
```

## Contact

- **Site**: [thejustinburrell.com](https://www.thejustinburrell.com/)
- **LinkedIn**: [thejustinburrell](https://www.linkedin.com/in/thejustinburrell/)
- **GitHub**: [JustinBurrell](https://github.com/JustinBurrell)
