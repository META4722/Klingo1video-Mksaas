import type { StorageConfig } from '../types';

/**
 * Default storage configuration
 *
 * This configuration is loaded from environment variables
 * Using a getter function to ensure environment variables are accessed at runtime
 */
export const getStorageConfig = (): StorageConfig => ({
  region: process.env.STORAGE_REGION || '',
  endpoint: process.env.STORAGE_ENDPOINT,
  accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || '',
  bucketName: process.env.STORAGE_BUCKET_NAME || '',
  publicUrl: process.env.STORAGE_PUBLIC_URL,
  forcePathStyle: process.env.STORAGE_FORCE_PATH_STYLE !== 'false',
});

/**
 * @deprecated Use getStorageConfig() instead for runtime env var access
 */
export const storageConfig: StorageConfig = getStorageConfig();
