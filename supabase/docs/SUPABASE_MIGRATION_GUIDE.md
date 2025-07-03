# Supabase Migration Guide

This guide will help you migrate your portfolio data from the static TypeScript file to a Supabase database.

## Prerequisites

- Supabase account (you mentioned you already have one)
- Node.js and npm installed
- Your portfolio project set up

## Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `personal-website` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be set up (usually 1-2 minutes)

## Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/supabase-schema.sql`
3. Paste and run the SQL script
4. This will create all necessary tables and policies

## Step 3: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...` - keep this secret!)

## Step 4: Configure Environment Variables

1. Open the `.env.local` file in your `frontend` directory
2. Replace the placeholder values with your actual Supabase credentials:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
REACT_APP_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 5: Run the Migration Script

1. Make sure you're in the `frontend` directory
2. Run the migration script:

```bash
npm run migrate-to-supabase
```

This will move all your current portfolio data to Supabase.

## Step 6: Test the Implementation

1. Start your development server: `npm start`
2. Navigate through your site to ensure all data loads correctly
3. Check the browser console for any errors
4. Test language switching functionality

## Step 7: Upload Images to Supabase Storage

1. In Supabase dashboard, go to **Storage**
2. You should see an `assets` bucket created by the schema
3. Upload your images to the appropriate folders:
   - `/assets/images/home/`
   - `/assets/images/about/`
   - `/assets/images/gallery/`
   - `/assets/images/education/`
   - `/assets/images/experiences/`
   - `/assets/images/projects/`

## Step 8: Update Image URLs (Optional)

If you want to serve images from Supabase Storage instead of your public folder:

1. Update the image URLs in your database to use Supabase Storage URLs
2. The format will be: `https://your-project-id.supabase.co/storage/v1/object/public/assets/path/to/image.jpg`

## Troubleshooting

### Common Issues:

1. **Environment Variables Not Loading**
   - Make sure `.env.local` is in the `frontend` directory
   - Restart your development server after adding env vars
   - Check that the variable names start with `REACT_APP_`

2. **Migration Script Fails**
   - Check that your environment variables are correct
   - Ensure the Supabase project is set up and running
   - Check the browser console for specific error messages

3. **Data Not Loading**
   - Check browser console for errors
   - Verify that data was migrated successfully in Supabase dashboard
   - Check that RLS policies are set up correctly

4. **CORS Errors**
   - Check that your Supabase URL is correct
   - Ensure RLS policies allow public read access

## Fallback System

The implementation includes a fallback system:
- If Supabase is unavailable, the site will use the static data
- If there's an error fetching from Supabase, it falls back to static data
- This ensures your site always works, even if Supabase is down

## Next Steps

After successful implementation:

1. **Deploy to Production**: Update your production environment variables
2. **Set Up Monitoring**: Use Supabase's built-in analytics
3. **Add Admin Authentication**: For secure content management
4. **Optimize Images**: Use Supabase's image transformations

## Rollback Plan

If you need to rollback:

1. The static data file is still available as a fallback
2. Simply remove the environment variables to disable Supabase
3. The site will automatically use the static data

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [React Supabase Integration](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native) 