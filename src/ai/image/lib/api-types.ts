import type { ProviderKey } from './provider-config';

export interface GenerateImageRequest {
  prompt: string;
  provider: ProviderKey;
  modelId: string;
  // Optional parameters for advanced generation
  size?: '1024x1024' | '2048x2048' | '4096x4096';
  aspectRatio?: string;
  referenceImage?: string; // base64 encoded image
}

export interface GenerateImageResponse {
  image?: string;
  error?: string;
}
