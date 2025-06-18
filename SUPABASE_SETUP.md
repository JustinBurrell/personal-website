# Supabase Backend Setup Guide

This guide will help you set up Supabase as your backend for the portfolio website.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `frontend` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be set up (usually 1-2 minutes)

## Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL script
4. This will create all necessary tables and policies

## Step 3: Configure Environment Variables

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**
   - **anon public** key
   - **service_role** key (keep this secret!)

3. Create a `.env.local` file in your project root:

```env
REACT_APP_SUPABASE_URL=your_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
REACT_APP_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 4: Migrate Your Data

1. Make sure your environment variables are set
2. Run the migration script:

```bash
npm run migrate-to-supabase
```

This will move all your current portfolio data to Supabase.

## Step 5: Update Components

The components have been updated to use the Supabase service instead of static imports. The main changes are:

- `src/services/supabase.js` - New service file
- Components now use `portfolioService.getPortfolioData()` instead of importing `portfolioData`
- Added loading states and error handling
- Implemented caching for better performance

## Step 6: Test the Implementation

1. Start your development server: `npm start`
2. Navigate through your site to ensure all data loads correctly
3. Check the browser console for any errors
4. Test language switching functionality

## Step 7: Set Up Storage for Images

1. In Supabase dashboard, go to **Storage**
2. You should see an `assets` bucket created by the schema
3. Upload your images to the appropriate folders:
   - `/assets/images/home/`
   - `/assets/images/about/`
   - `/assets/images/gallery/`
   - etc.

## Step 8: Admin Dashboard (Optional)

For easy content management, you can:

1. Use Supabase's built-in **Table Editor** to manage content
2. Or create a custom admin dashboard using the Supabase client

## Performance Benefits

With this implementation, you'll get:

- **Faster Initial Load**: No large data bundles
- **Real-time Updates**: Changes appear instantly
- **Better Caching**: 5-minute cache for API responses
- **Scalability**: Easy to add new content
- **Multi-language Support**: Built into the database

## Troubleshooting

### Common Issues:

1. **Environment Variables Not Loading**
   - Make sure `.env.local` is in the project root
   - Restart your development server after adding env vars

2. **CORS Errors**
   - Check that your Supabase URL is correct
   - Ensure RLS policies are set up correctly

3. **Data Not Loading**
   - Check browser console for errors
   - Verify that data was migrated successfully
   - Check Supabase dashboard for any failed requests

4. **Images Not Loading**
   - Ensure images are uploaded to Supabase Storage
   - Check that storage policies allow public read access

## Next Steps

After successful implementation:

1. **Deploy to Production**: Update your production environment variables
2. **Set Up Monitoring**: Use Supabase's built-in analytics
3. **Add Admin Authentication**: For secure content management
4. **Optimize Images**: Use Supabase's image transformations

## Rollback Plan

If you need to rollback:

1. Switch back to the `main` branch: `git checkout main`
2. Your original site will work as before
3. The Supabase implementation is isolated to the feature branch

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [React Supabase Integration](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native) 