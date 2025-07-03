# Supabase Image Migration Guide

This guide explains how to migrate all your images from the public folder to Supabase Storage and update your database accordingly.

## How the Database Schema Works

### 1. **Data Storage Structure**

Your portfolio data is stored in several tables:

#### **`portfolio_sections`** - Main content sections
```json
{
  "section_name": "home",
  "content": {
    "imageUrl": "https://your-project.supabase.co/storage/v1/object/public/assets/images/home/headshot.jpg",
    "title": "Hi, I'm Justin Burrell.",
    "description": "...",
    "organizations": [...],
    "qualities": [...]
  }
}
```

#### **`gallery_items`** - Individual gallery entries
```json
{
  "title": "Men of Color Symposium",
  "image_url": "https://your-project.supabase.co/storage/v1/object/public/assets/images/gallery/moca/group-photo.jpeg",
  "description": "...",
  "categories": [...]
}
```

#### **`projects`** - Project entries
```json
{
  "title": "AI/ML Student Score Predictor",
  "image_url": "https://your-project.supabase.co/storage/v1/object/public/assets/images/projects/score-predictor.png",
  "description": "...",
  "technologies": [...]
}
```

### 2. **Supabase Storage Structure**

Images are stored in the `assets` bucket with this structure:
```
assets/
├── images/
│   ├── home/
│   │   └── FLOC Headshot.jpeg
│   ├── about/
│   │   └── About Background Photo.jpg
│   ├── gallery/
│   │   ├── moca/
│   │   ├── colorstack/
│   │   └── kappa/
│   ├── education/
│   ├── experiences/
│   └── projects/
└── documents/
    └── Justin Burrell Resume.pdf
```

## Complete Migration Process

### Step 1: Set Up Supabase (if not done already)

```bash
npm run setup-supabase
```

### Step 2: Run Database Schema

1. Go to your Supabase dashboard → SQL Editor
2. Copy and run the contents of `supabase/supabase-schema.sql`

### Step 3: Migrate Portfolio Data

```bash
npm run migrate-to-supabase
```

### Step 4: Migrate Images to Supabase Storage

```bash
npm run migrate-images
```

This script will:
- Upload all images from `public/assets/` to Supabase Storage
- Maintain the same folder structure
- Generate a report of all uploaded files
- Create public URLs for each image

### Step 5: Update Database with New Image URLs

```bash
npm run update-image-urls
```

This script will:
- Read the migration report
- Update all database records with Supabase Storage URLs
- Replace local paths like `/assets/images/home/headshot.jpg` with full Supabase URLs

## Image URL Transformation

### Before Migration:
```javascript
// Local paths in your data
{
  "imageUrl": "/assets/images/home/FLOC Headshot.jpeg",
  "resumeUrl": "/assets/documents/Justin Burrell Resume.pdf"
}
```

### After Migration:
```javascript
// Supabase Storage URLs
{
  "imageUrl": "https://your-project.supabase.co/storage/v1/object/public/assets/images/home/FLOC Headshot.jpeg",
  "resumeUrl": "https://your-project.supabase.co/storage/v1/object/public/assets/documents/Justin Burrell Resume.pdf"
}
```

## Benefits of Using Supabase Storage

### 1. **Performance**
- Global CDN distribution
- Automatic image optimization
- Faster loading times

### 2. **Scalability**
- No storage limits (within your plan)
- Automatic backups
- Built-in versioning

### 3. **Cost Efficiency**
- Pay only for what you use
- No server storage costs
- Bandwidth included

### 4. **Security**
- Row Level Security (RLS)
- Public read access for images
- Authenticated upload/update/delete

## Advanced Features

### Image Transformations

Supabase Storage supports on-the-fly image transformations:

```javascript
// Resize image to 300x300
const resizedUrl = `${supabaseUrl}/storage/v1/object/public/assets/images/home/headshot.jpg?width=300&height=300`

// Convert to WebP format
const webpUrl = `${supabaseUrl}/storage/v1/object/public/assets/images/home/headshot.jpg?format=webp`

// Apply blur effect
const blurredUrl = `${supabaseUrl}/storage/v1/object/public/assets/images/home/headshot.jpg?blur=10`
```

### Asset Management

You can use the `portfolio_assets` table to track all your assets:

```sql
INSERT INTO portfolio_assets (asset_type, file_name, file_path, section_name) 
VALUES ('image', 'headshot.jpg', 'images/home/headshot.jpg', 'home');
```

## Troubleshooting

### Common Issues:

1. **Images Not Loading**
   - Check that the storage bucket is public
   - Verify RLS policies allow public read access
   - Ensure image URLs are correctly formatted

2. **Migration Fails**
   - Check environment variables are set correctly
   - Ensure you have sufficient storage space
   - Verify file permissions

3. **Database Update Fails**
   - Check that the migration report exists
   - Verify database connection
   - Ensure you have write permissions

### Rollback Plan:

If you need to rollback:
1. Keep your original `public/assets/` folder as backup
2. Update database records back to local paths
3. Remove images from Supabase Storage if needed

## Monitoring and Analytics

Supabase provides built-in analytics:
- Storage usage metrics
- Bandwidth consumption
- Request patterns
- Error rates

Access these in your Supabase dashboard under **Analytics**.

## Next Steps

After successful migration:

1. **Test thoroughly** - Ensure all images load correctly
2. **Optimize images** - Use Supabase transformations for better performance
3. **Set up monitoring** - Track storage usage and performance
4. **Update deployment** - Remove images from your deployment bundle
5. **Backup strategy** - Consider additional backup solutions

## Support

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Image Transformations](https://supabase.com/docs/guides/storage/image-transformations)
- [Storage API Reference](https://supabase.com/docs/reference/javascript/storage-createbucket) 