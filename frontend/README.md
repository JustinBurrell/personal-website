# Personal Website Project

A modern portfolio website built with React and Supabase backend.

## Project Structure

```
personalWebsiteProject/
├── frontend/     # React frontend application
├── supabase-schema.sql    # Database schema for Supabase
├── SUPABASE_SETUP.md      # Detailed setup instructions
└── README.md              # This file
```

## Architecture

- **Frontend**: React with TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL database + real-time API)
- **Storage**: Supabase Storage for images and assets
- **Admin**: Supabase Dashboard for content management
- **Translation**: Google Cloud Translate API integration

## Features

- **Fast Performance**: Cached API calls and optimized loading
- **Real-time Updates**: Changes appear instantly across all users
- **Multi-language Support**: 10+ languages with Google Translate
- **Responsive Design**: Works perfectly on all devices
- **Easy Content Management**: Use Supabase dashboard to update content
- **Image Management**: Centralized storage with Supabase

## Quick Start

1. **Set up Supabase**: Follow instructions in `SUPABASE_SETUP.md`
2. **Install dependencies**: `cd frontend && npm install`
3. **Configure environment**: Create `.env.local` with Supabase credentials
4. **Migrate data**: `npm run migrate-to-supabase`
5. **Start development**: `npm start`

## Development

### Frontend Development
```bash
cd frontend
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

### Database Management
- Use Supabase Dashboard for all database operations
- Run `supabase-schema.sql` in Supabase SQL Editor
- Manage content through Table Editor

### Content Updates
1. Log into Supabase Dashboard
2. Navigate to Table Editor
3. Edit content directly in the tables
4. Changes appear instantly on your website

## Performance Benefits

- **Faster Loading**: No large data bundles
- **Better Caching**: 5-minute API response caching
- **Optimized Images**: Supabase image transformations
- **Real-time Updates**: Live content changes
- **Scalable**: Easy to add new sections and content

## Deployment

1. **Frontend**: Deploy to Vercel, Netlify, or your preferred platform
2. **Backend**: Supabase handles all backend infrastructure
3. **Environment Variables**: Set production Supabase credentials

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## License

MIT License
