import { env } from "@/lib/env";

export interface StorageProvider {
  createUploadUrl(fileName: string, mimeType: string, size: number, organizationId: string): Promise<{ url: string; key: string }>;
  getSignedDownloadUrl(storageKey: string): Promise<string>;
  deleteFile(storageKey: string): Promise<void>;
  validateUploadFile(mimeType: string, size: number): boolean;
  saveFileMetadata(key: string, metadata: unknown): Promise<void>;
}

const ALLOWED_MIME_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

class MockStorageProvider implements StorageProvider {
  validateUploadFile(mimeType: string, size: number) {
    return ALLOWED_MIME_TYPES.includes(mimeType) && size <= MAX_FILE_SIZE;
  }
  async createUploadUrl(fileName: string, mimeType: string, size: number, organizationId: string) {
    if (!this.validateUploadFile(mimeType, size)) throw new Error("Invalid file type or size");
    console.log(`💾 [Mock Storage] Created upload URL for ${fileName} (${organizationId})`);
    const key = `mock-${Date.now()}-${fileName}`;
    return { url: `http://localhost:3000/api/mock-upload?key=${key}`, key };
  }
  async getSignedDownloadUrl(storageKey: string) {
    return `http://localhost:3000/mock-download/${storageKey}`;
  }
  async deleteFile(storageKey: string) {
    console.log(`💾 [Mock Storage] Deleted file: ${storageKey}`);
  }
  async saveFileMetadata(key: string, metadata: unknown) {
    console.log(`💾 [Mock Storage] Saved metadata for ${key}`);
  }
}

class S3StorageProvider implements StorageProvider {
  validateUploadFile(mimeType: string, size: number) {
    return ALLOWED_MIME_TYPES.includes(mimeType) && size <= MAX_FILE_SIZE;
  }
  async createUploadUrl(fileName: string, mimeType: string, size: number, organizationId: string) {
    if (!env.S3_BUCKET) throw new Error("S3 missing configuration");
    if (!this.validateUploadFile(mimeType, size)) throw new Error("Invalid file");
    return { url: "https://s3.amazonaws.com/presigned...", key: `s3-${Date.now()}-${fileName}` };
  }
  async getSignedDownloadUrl(storageKey: string) {
    return `https://s3.amazonaws.com/download...`;
  }
  async deleteFile(storageKey: string) {
    console.log(`💾 [S3 Storage] Deleting ${storageKey}`);
  }
  async saveFileMetadata(key: string, metadata: unknown) {
    // Save to DB
  }
}

export const storageProvider: StorageProvider = 
  env.STORAGE_PROVIDER === "s3"
    ? new S3StorageProvider()
    : new MockStorageProvider();
