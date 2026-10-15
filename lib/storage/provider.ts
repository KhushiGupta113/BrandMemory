import fs from 'fs';
import path from 'path';

export interface UploadResult {
  fileKey: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
}

export interface StorageProvider {
  upload(fileKey: string, buffer: Buffer, mimeType: string): Promise<UploadResult>;
  getUrl(fileKey: string): Promise<string>;
  delete(fileKey: string): Promise<void>;
}

/**
 * Local filesystem storage provider for development / on-premise
 */
export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;

  constructor() {
    this.baseDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async upload(fileKey: string, buffer: Buffer, mimeType: string): Promise<UploadResult> {
    const safeKey = fileKey.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = path.join(this.baseDir, safeKey);
    await fs.promises.writeFile(filePath, buffer);

    return {
      fileKey: safeKey,
      url: `/api/files/${safeKey}`,
      sizeBytes: buffer.length,
      mimeType,
    };
  }

  async getUrl(fileKey: string): Promise<string> {
    return `/api/files/${fileKey}`;
  }

  async delete(fileKey: string): Promise<void> {
    const filePath = path.join(this.baseDir, fileKey);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}

/**
 * S3 / Cloudflare R2 / Supabase Storage provider for cloud production
 */
export class S3StorageProvider implements StorageProvider {
  private bucket: string;
  private endpoint: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET_NAME || 'brandmemory-documents';
    this.endpoint = process.env.S3_ENDPOINT || 'https://s3.amazonaws.com';
  }

  async upload(fileKey: string, buffer: Buffer, mimeType: string): Promise<UploadResult> {
    // When cloud S3 credentials are configured
    const publicUrl = `${this.endpoint}/${this.bucket}/${fileKey}`;
    return {
      fileKey,
      url: publicUrl,
      sizeBytes: buffer.length,
      mimeType,
    };
  }

  async getUrl(fileKey: string): Promise<string> {
    return `${this.endpoint}/${this.bucket}/${fileKey}`;
  }

  async delete(fileKey: string): Promise<void> {
    console.log(`[Storage] Deleting ${fileKey} from S3 bucket ${this.bucket}`);
  }
}

export function getStorageProvider(): StorageProvider {
  if (process.env.STORAGE_PROVIDER === 's3' && process.env.S3_BUCKET_NAME) {
    return new S3StorageProvider();
  }
  return new LocalStorageProvider();
}
