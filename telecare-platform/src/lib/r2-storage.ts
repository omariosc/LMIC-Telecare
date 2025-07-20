// R2 Storage helper functions for Cloudflare R2
// Handles file uploads, downloads, and management

export interface R2Object {
  key: string;
  size: number;
  etag: string;
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
  range?: R2Range;
  checksums?: R2Checksums;
  uploaded: Date;
}

export interface R2HTTPMetadata {
  contentType?: string;
  contentLanguage?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  cacheControl?: string;
  cacheExpiry?: Date;
}

export interface R2Range {
  offset?: number;
  length?: number;
  suffix?: number;
}

export interface R2Checksums {
  md5?: ArrayBuffer;
  sha1?: ArrayBuffer;
  sha256?: ArrayBuffer;
  sha384?: ArrayBuffer;
  sha512?: ArrayBuffer;
}

// R2 bucket interface for Cloudflare Pages/Workers
export interface R2Bucket {
  get(key: string, options?: R2GetOptions): Promise<R2Object | null>;
  put(
    key: string,
    value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob,
    options?: R2PutOptions
  ): Promise<R2Object>;
  delete(keys: string | string[]): Promise<void>;
  list(options?: R2ListOptions): Promise<R2Objects>;
  head(key: string): Promise<R2Object | null>;
  createMultipartUpload(key: string, options?: R2CreateMultipartUploadOptions): Promise<R2MultipartUpload>;
}

export interface R2GetOptions {
  onlyIf?: R2Conditional;
  range?: R2Range;
}

export interface R2PutOptions {
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
  md5?: ArrayBuffer;
  sha1?: ArrayBuffer;
  sha256?: ArrayBuffer;
  sha384?: ArrayBuffer;
  sha512?: ArrayBuffer;
  onlyIf?: R2Conditional;
}

export interface R2ListOptions {
  limit?: number;
  prefix?: string;
  cursor?: string;
  delimiter?: string;
  startAfter?: string;
  include?: ("httpMetadata" | "customMetadata")[];
}

export interface R2Objects {
  objects: R2Object[];
  truncated: boolean;
  cursor?: string;
  delimitedPrefixes: string[];
}

export interface R2Conditional {
  etagMatches?: string;
  etagDoesNotMatch?: string;
  uploadedBefore?: Date;
  uploadedAfter?: Date;
}

export interface R2CreateMultipartUploadOptions {
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
}

export interface R2MultipartUpload {
  uploadId: string;
  key: string;
  complete(parts: R2UploadedPart[]): Promise<R2Object>;
  abort(): Promise<void>;
  uploadPart(partNumber: number, value: ReadableStream | ArrayBuffer | ArrayBufferView | string | Blob): Promise<R2UploadedPart>;
}

export interface R2UploadedPart {
  partNumber: number;
  etag: string;
}

export class R2StorageHelper {
  constructor(private bucket: R2Bucket) {}

  // Upload a file with metadata
  async uploadFile(
    key: string,
    file: File | Blob | ArrayBuffer | string,
    options?: {
      contentType?: string;
      metadata?: Record<string, string>;
    }
  ): Promise<R2Object> {
    const putOptions: R2PutOptions = {
      httpMetadata: {
        contentType: options?.contentType || "application/octet-stream",
      },
      customMetadata: options?.metadata,
    };

    return await this.bucket.put(key, file, putOptions);
  }

  // Upload user profile image
  async uploadProfileImage(
    userId: string,
    imageFile: File | Blob,
    imageType: string = "image/jpeg"
  ): Promise<string> {
    const key = `profile-images/${userId}/${Date.now()}.${imageType.split("/")[1]}`;
    
    await this.uploadFile(key, imageFile, {
      contentType: imageType,
      metadata: {
        purpose: "profile_image",
        userId: userId,
        uploadedAt: new Date().toISOString(),
      },
    });

    return key;
  }

  // Upload medical case attachment
  async uploadCaseAttachment(
    caseId: string,
    file: File | Blob,
    fileName: string,
    contentType: string
  ): Promise<string> {
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `case-attachments/${caseId}/${Date.now()}_${sanitizedFileName}`;
    
    await this.uploadFile(key, file, {
      contentType,
      metadata: {
        purpose: "case_attachment",
        caseId: caseId,
        originalFileName: fileName,
        uploadedAt: new Date().toISOString(),
      },
    });

    return key;
  }

  // Upload verification document
  async uploadVerificationDocument(
    userId: string,
    file: File | Blob,
    documentType: string,
    fileName: string
  ): Promise<string> {
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `verification-docs/${userId}/${documentType}_${Date.now()}_${sanitizedFileName}`;
    
    await this.uploadFile(key, file, {
      contentType: file instanceof File ? file.type : "application/octet-stream",
      metadata: {
        purpose: "verification_document",
        userId: userId,
        documentType: documentType,
        originalFileName: fileName,
        uploadedAt: new Date().toISOString(),
      },
    });

    return key;
  }

  // Get file
  async getFile(key: string): Promise<R2Object | null> {
    return await this.bucket.get(key);
  }

  // Delete file
  async deleteFile(key: string): Promise<void> {
    await this.bucket.delete(key);
  }

  // List files with prefix
  async listFiles(prefix: string, limit: number = 100): Promise<R2Objects> {
    return await this.bucket.list({
      prefix,
      limit,
      include: ["httpMetadata", "customMetadata"],
    });
  }

  // Generate a signed URL for direct browser uploads (would need to be implemented on the server side)
  generateUploadUrl(key: string, expiresIn: number = 3600): string {
    // This would need to be implemented with R2's presigned URL functionality
    // For now, return a placeholder
    throw new Error("Presigned URLs not implemented - use direct uploads through the application");
  }

  // Get download URL (for public access)
  getDownloadUrl(key: string): string {
    // This assumes you have a public domain configured for your R2 bucket
    // You would need to configure this in your Cloudflare dashboard
    return `https://your-bucket-domain.com/${key}`;
  }
}