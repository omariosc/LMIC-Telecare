# R2 Storage Setup Guide

## Overview

Cloudflare R2 storage has been successfully set up for the Telecare Platform with three buckets for different environments.

## Created R2 Buckets

### Production
- **Bucket Name**: `telecare-platform-storage-prod`
- **Purpose**: Production file storage
- **Binding**: `STORAGE`
- **Usage**: Medical case attachments, profile images, verification documents

### Staging
- **Bucket Name**: `telecare-platform-storage-staging`
- **Purpose**: Staging environment testing
- **Binding**: `STORAGE`

### Development
- **Bucket Name**: `telecare-platform-storage-dev`
- **Purpose**: Local development and testing
- **Binding**: `STORAGE`

## File Organization Structure

```
bucket/
├── profile-images/
│   └── {userId}/
│       └── {timestamp}.{ext}
├── case-attachments/
│   └── {caseId}/
│       └── {timestamp}_{filename}
├── verification-docs/
│   └── {userId}/
│       └── {documentType}_{timestamp}_{filename}
└── system-assets/
    └── (logos, icons, etc.)
```

## Usage in Application

### Environment Binding Access

In your Cloudflare Pages Functions or Workers, access R2 through the environment binding:

```typescript
// In a Pages Function (pages/api/upload.ts)
export async function onRequestPost(context) {
  const { STORAGE } = context.env;
  
  // STORAGE is now your R2 bucket
  await STORAGE.put("filename.jpg", fileData);
}
```

### Using the R2StorageHelper Class

```typescript
import { R2StorageHelper } from '@/lib/r2-storage';

// Initialize with the bucket binding
const storageHelper = new R2StorageHelper(context.env.STORAGE);

// Upload profile image
const imageKey = await storageHelper.uploadProfileImage(
  userId, 
  imageFile, 
  'image/jpeg'
);

// Upload case attachment
const attachmentKey = await storageHelper.uploadCaseAttachment(
  caseId,
  file,
  'xray-scan.png',
  'image/png'
);

// Upload verification document
const docKey = await storageHelper.uploadVerificationDocument(
  userId,
  documentFile,
  'medical_license',
  'license.pdf'
);
```

## Pages Environment Configuration

Since this is a Cloudflare Pages project, you need to configure environment bindings through the dashboard:

### 1. Configure Production Environment

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **telecare-platform**
3. Go to **Settings** → **Functions**
4. In **Environment Variables**, add:
   - **Production**:
     - **R2 Bucket Bindings**:
       - Variable name: `STORAGE`
       - R2 bucket: `telecare-platform-storage-prod`

### 2. Configure Preview Environment (Staging)

In the same Functions settings:
- **Preview**:
  - **R2 Bucket Bindings**:
    - Variable name: `STORAGE`
    - R2 bucket: `telecare-platform-storage-staging`

## CORS Configuration

CORS needs to be configured for web uploads. If the CLI method fails, configure via dashboard:

1. Go to **R2 Object Storage** in Cloudflare Dashboard
2. Select your bucket (e.g., `telecare-platform-storage-prod`)
3. Go to **Settings** → **CORS policy**
4. Add the following configuration:

```json
[
  {
    "allowed_origins": [
      "https://telecare-platform.pages.dev",
      "https://*.telecare-platform.pages.dev",
      "http://localhost:3000"
    ],
    "allowed_methods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "allowed_headers": ["*"],
    "expose_headers": ["ETag"],
    "max_age_seconds": 3600
  }
]
```

## File Upload Limits & Best Practices

### Size Limits
- **Maximum file size**: 5TB per object
- **Recommended max for web uploads**: 100MB
- **Profile images**: Limit to 5MB
- **Medical attachments**: Limit to 50MB per file

### Security Best Practices
1. **Validate file types** before upload
2. **Scan files** for malware (consider Cloudflare's security scanning)
3. **Use unique, non-guessable keys** for sensitive documents
4. **Set appropriate metadata** for content type and purpose
5. **Implement access controls** based on user roles

### Performance Optimization
1. **Use multipart uploads** for files > 100MB
2. **Implement client-side compression** for images
3. **Cache frequently accessed files** using KV or Cache API
4. **Use appropriate content types** for better browser handling

## Testing

### Test File Upload/Download

```bash
# Upload test file
npm run test:r2:upload

# List bucket contents (via API)
npm run test:r2:list

# Download test file
npm run test:r2:download

# Clean up test files
npm run test:r2:cleanup
```

### Manual Testing Commands

```bash
# Upload a file
npx wrangler r2 object put telecare-platform-storage-prod/test.txt --file test.txt

# Download a file
npx wrangler r2 object get telecare-platform-storage-prod/test.txt --file downloaded.txt

# Delete a file
npx wrangler r2 object delete telecare-platform-storage-prod/test.txt
```

## Monitoring & Analytics

- **Storage usage**: Monitor in Cloudflare Dashboard → R2 → Analytics
- **Request patterns**: Track in Pages Analytics
- **Error rates**: Monitor upload/download success rates
- **Cost optimization**: R2 has no egress fees, but monitor storage and operations

## Troubleshooting

### Common Issues

1. **403 Forbidden**: Check CORS configuration and environment bindings
2. **File not found**: Verify bucket name and object key
3. **Upload fails**: Check file size limits and content type
4. **CORS errors**: Ensure origin is whitelisted in CORS policy

### Debug Commands

```bash
# Check if buckets exist
npx wrangler r2 bucket list

# Test bucket access
npx wrangler r2 object put bucket-name/test.txt --file test.txt

# Check CORS settings
npx wrangler r2 bucket cors list bucket-name
```

## Next Steps

1. **Configure environment bindings** in Pages dashboard
2. **Set up CORS policies** for each bucket
3. **Implement file upload components** in the frontend
4. **Add file validation** and security measures
5. **Test end-to-end** file upload/download workflow
6. **Monitor usage** and optimize as needed

## Support

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Pages Functions Documentation](https://developers.cloudflare.com/pages/functions/)
- [R2 API Reference](https://developers.cloudflare.com/r2/api/)