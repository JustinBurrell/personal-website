#!/usr/bin/env node
/**
 * Image Optimization Script
 *
 * Downloads all images from Supabase Storage, compresses them to WebP,
 * and re-uploads them alongside the originals.
 *
 * Usage (from the server/ directory):
 *   node optimize-images.js
 *
 * Requirements (already in server/):
 *   npm install sharp   (run once in server/)
 *
 * Reads credentials from server/.env:
 *   SUPABASE_URL=https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { readFileSync } from 'fs';
import path from 'path';

// Load env from .env in the same directory as this script
let env = {};
try {
  const envFile = readFileSync(new URL('./.env', import.meta.url), 'utf-8');
  envFile.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && !key.startsWith('#')) env[key.trim()] = val.join('=').trim();
  });
} catch {
  // Fall back to process.env
}

const SUPABASE_URL = process.env.SUPABASE_URL || env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const BUCKET = 'assets';

// Max widths per image category (px). Images smaller than this are not upscaled.
const MAX_WIDTHS = {
  'images/home':        800,
  'images/about':       1200,
  'images/gallery':     1200,
  'images/projects':    800,
  'images/education':   400,
  'images/experiences': 800,
  'images/awards':      800,
};

const DEFAULT_MAX_WIDTH = 1200;
const WEBP_QUALITY = 78;

// Extensions that sharp can process
const PROCESSABLE = new Set(['jpg', 'jpeg', 'png', 'gif', 'avif', 'tiff']);

async function listAllFiles(prefix = '') {
  const files = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(prefix, { limit, offset, sortBy: { column: 'name', order: 'asc' } });

    if (error) throw error;
    if (!data || data.length === 0) break;

    for (const item of data) {
      const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id === null) {
        // It's a folder — recurse
        const nested = await listAllFiles(fullPath);
        files.push(...nested);
      } else {
        files.push(fullPath);
      }
    }

    if (data.length < limit) break;
    offset += limit;
  }

  return files;
}

function getMaxWidth(filePath) {
  for (const [prefix, width] of Object.entries(MAX_WIDTHS)) {
    if (filePath.includes(prefix)) return width;
  }
  return DEFAULT_MAX_WIDTH;
}

function getWebpPath(filePath) {
  return filePath.replace(/\.[^.]+$/, '.webp');
}

async function downloadFile(filePath) {
  const { data, error } = await supabase.storage.from(BUCKET).download(filePath);
  if (error) throw new Error(`Download failed for ${filePath}: ${error.message}`);
  return Buffer.from(await data.arrayBuffer());
}

async function uploadFile(filePath, buffer, contentType = 'image/webp') {
  const { error } = await supabase.storage.from(BUCKET).upload(filePath, buffer, {
    contentType,
    upsert: true,
    cacheControl: '86400',
  });
  if (error) throw new Error(`Upload failed for ${filePath}: ${error.message}`);
}

async function main() {
  console.log('Listing all files in Supabase Storage bucket:', BUCKET);
  const allFiles = await listAllFiles('images');
  const imageFiles = allFiles.filter(f => {
    const ext = path.extname(f).toLowerCase().slice(1);
    return PROCESSABLE.has(ext);
  });

  console.log(`Found ${imageFiles.length} images to process.\n`);

  const results = { optimized: [], failed: [] };

  for (const filePath of imageFiles) {
    const webpPath = getWebpPath(filePath);
    const maxWidth = getMaxWidth(filePath);
    process.stdout.write(`Processing: ${filePath} → ${webpPath} (max ${maxWidth}px)... `);

    try {
      const originalBuffer = await downloadFile(filePath);
      const metadata = await sharp(originalBuffer).metadata();

      const resizeWidth = metadata.width && metadata.width > maxWidth ? maxWidth : undefined;

      const webpBuffer = await sharp(originalBuffer)
        .resize(resizeWidth ? { width: resizeWidth, withoutEnlargement: true } : undefined)
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();

      const savings = (((originalBuffer.length - webpBuffer.length) / originalBuffer.length) * 100).toFixed(1);

      await uploadFile(webpPath, webpBuffer);

      console.log(`✓ ${savings}% smaller (${(originalBuffer.length / 1024).toFixed(0)}KB → ${(webpBuffer.length / 1024).toFixed(0)}KB)`);
      results.optimized.push({ original: filePath, webp: webpPath, savings });
    } catch (err) {
      console.log(`✗ ${err.message}`);
      results.failed.push({ file: filePath, error: err.message });
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Optimized: ${results.optimized.length}`);
  console.log(`Failed: ${results.failed.length}`);

  if (results.optimized.length > 0) {
    console.log('\nOptimized files (update these URLs in your database to use .webp versions):');
    results.optimized.forEach(r => {
      console.log(`  ${r.original} → ${r.webp} (${r.savings}% smaller)`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\nFailed files:');
    results.failed.forEach(r => console.log(`  ${r.file}: ${r.error}`));
  }

  console.log('\nDone! WebP files are uploaded alongside originals.');
  console.log('To use them, update the image URLs in your Supabase database rows to the .webp paths.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
