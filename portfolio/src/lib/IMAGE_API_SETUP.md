# Image API Setup Guide

This guide explains how to transition from Picsum placeholder images to your protected image API.

## Current Setup

The gallery is currently configured to use **Picsum placeholder images** for development. All image URLs are generated through the `imageService`, making it easy to switch to your API when ready.

## Architecture

```
┌─────────────────────────────────────┐
│  PhotoGallery Component             │
│  Uses: getImageUrl() from service   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  imageService.ts                    │
│  - Routes to Picsum or API          │
│  - Based on imageConfig.ts          │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌─────────────┐  ┌──────────────┐
│  Picsum     │  │  API Route   │
│  (Dev)      │  │  (Prod)      │
└─────────────┘  └──────────────┘
```

## Files Created

1. **`src/config/imageConfig.ts`** - Configuration for switching between sources
2. **`src/lib/imageService.ts`** - Service for generating image URLs
3. **`src/lib/imageProtection.ts`** - Protection utilities (referrer checking, etc.)
4. **`src/app/api/images/[id]/route.ts`** - API route for serving images

## Transition Steps

### Step 1: Prepare Your Images

Store your images in **private storage** (NOT in `/public` folder). Options:
- Local filesystem: `private-images/` folder (add to `.gitignore`)
- Cloud storage: AWS S3, Cloudinary, etc.
- Database: Store image data in your database

### Step 2: Implement Image Storage Service

Create `src/lib/imageStorage.ts`:

```typescript
/**
 * Image Storage Service
 * 
 * Handles reading images from your storage solution.
 */

export async function getImageFromStorage(
  id: string,
  variant: 'thumbnail' | 'medium' | 'full'
): Promise<Buffer | null> {
  // TODO: Implement based on your storage solution
  
  // Example for local filesystem:
  // const fs = require('fs').promises
  // const path = require('path')
  // const imagePath = path.join(process.cwd(), 'private-images', `${id}-${variant}.jpg`)
  // return await fs.readFile(imagePath)
  
  // Example for S3:
  // const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')
  // const s3 = new S3Client({ region: 'us-east-1' })
  // const command = new GetObjectCommand({
  //   Bucket: 'your-bucket',
  //   Key: `${id}/${variant}.jpg`
  // })
  // const response = await s3.send(command)
  // return Buffer.from(await response.Body.transformToByteArray())
  
  return null
}
```

### Step 3: Update API Route

Edit `src/app/api/images/[id]/route.ts`:

1. Import your image storage service:
```typescript
import { getImageFromStorage } from '@/lib/imageStorage'
```

2. Replace the TODO section with actual image retrieval:
```typescript
// Get image from storage
const imageBuffer = await getImageFromStorage(id, variant)

if (!imageBuffer) {
  return new NextResponse('Image not found', { status: 404 })
}

// Determine content type
const contentType = getContentType(id)

// Return image with cache headers
return new NextResponse(imageBuffer, {
  headers: {
    'Content-Type': contentType,
    ...getImageCacheHeaders(),
  },
})
```

### Step 4: Update Configuration

Edit `src/config/imageConfig.ts`:

```typescript
export const imageConfig: ImageConfig = {
  source: 'api', // Change from 'picsum' to 'api'
  enableProtection: true, // Enable protection features
  allowedReferrers: [
    'localhost',
    '127.0.0.1',
    'yourdomain.com', // Add your production domain
    'www.yourdomain.com',
  ],
  apiBaseUrl: '/api/images',
}
```

### Step 5: Update Gallery Items

When you have a database or data source, update `PhotoGallery.tsx` to fetch real image IDs:

```typescript
// Instead of generating placeholder items, fetch from your API/database
useEffect(() => {
  // Fetch gallery items from your API
  fetch('/api/gallery-items')
    .then(res => res.json())
    .then(data => {
      const items = data.map((item: YourItemType) => ({
        id: item.id, // Real image ID from database
        aspectRatio: item.aspectRatio,
        columnSpan: item.columnSpan,
        imageUrl: getImageUrl({
          id: item.id,
          aspectRatio: item.aspectRatioType,
        })
      }))
      setItems(items)
    })
}, [])
```

## Protection Features

When `enableProtection` is `true`, the API route will:

1. **Check Referrer** - Only allow requests from your domain
2. **Rate Limiting** - (Can be added using existing `rateLimit.ts`)
3. **Cache Headers** - Optimized caching for performance

### Adding More Protection

Edit `src/lib/imageProtection.ts` to add:
- User authentication checks
- IP whitelisting
- Request rate limiting
- Watermarking on-the-fly

## Testing

1. **Development (Picsum)**: Gallery should work as before
2. **API Route**: Test with `curl` or browser:
   ```bash
   curl http://localhost:3000/api/images/1?variant=medium
   ```
3. **Protection**: Test referrer checking by making requests without proper referrer

## Performance Tips

1. **Use Next.js Image Component** (when ready):
   ```tsx
   import Image from 'next/image'
   
   <Image
     src={getImageUrl({ id: item.id, variant: 'thumbnail' })}
     alt="Gallery image"
     width={400}
     height={400}
     loading="lazy"
   />
   ```

2. **Optimize Images**: Use Sharp or Cloudinary for on-the-fly optimization
3. **CDN**: Deploy to Vercel Edge Network or Cloudflare for faster delivery
4. **Caching**: Images are cached with `max-age=31536000` for optimal performance

## Troubleshooting

- **Images not loading**: Check that `imageConfig.source` is set correctly
- **403 Forbidden**: Check `allowedReferrers` includes your domain
- **404 Not Found**: Verify image storage path and file existence
- **Slow loading**: Ensure images are optimized and served from CDN

