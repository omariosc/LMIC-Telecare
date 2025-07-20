// Image upload utilities for Cloudflare Images
// Note: This requires proper Cloudflare configuration with API keys

export interface UploadedImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  uploadedAt: string;
}

/**
 * Upload image to Cloudflare Images
 * In production, this would use the Cloudflare Images API
 * For demo purposes, we'll return the original URL
 */
export async function uploadToCloudflare(file: File | string): Promise<UploadedImage> {
  // If it's already a URL, return it as is
  if (typeof file === 'string' && file.startsWith('http')) {
    return {
      id: `img_${Date.now()}`,
      url: file,
      thumbnailUrl: file,
      uploadedAt: new Date().toISOString()
    };
  }

  // For actual file uploads in production:
  // 1. Convert File to FormData
  // 2. POST to Cloudflare Images API endpoint
  // 3. Return the CDN URLs
  
  // Demo implementation - convert to data URL
  if (file instanceof File) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        resolve({
          id: `img_${Date.now()}`,
          url: dataUrl,
          thumbnailUrl: dataUrl,
          uploadedAt: new Date().toISOString()
        });
      };
      reader.readAsDataURL(file);
    });
  }

  throw new Error('Invalid file type');
}

/**
 * Get optimized image URL from Cloudflare
 * @param url Original image URL
 * @param variant Size variant (thumbnail, display, full)
 */
export function getOptimizedImageUrl(url: string, variant: 'thumbnail' | 'display' | 'full' = 'display'): string {
  // In production with Cloudflare Images:
  // return `https://imagedelivery.net/your-account-hash/${imageId}/${variant}`;
  
  // For demo, return original URL
  return url;
}

/**
 * Delete image from Cloudflare
 */
export async function deleteFromCloudflare(imageId: string): Promise<boolean> {
  // In production: DELETE request to Cloudflare API
  console.log('Delete image:', imageId);
  return true;
}