'use client';

import type { GenerateImageRequest } from '@/ai/image/lib/api-types';
import {
  consumeCreditsAction,
  getUserCreditsAction,
  hasEnoughCreditsAction,
} from '@/actions/credits';
import { useSession } from '@/hooks/use-session';
import { useState } from 'react';

interface SeedreamParams {
  prompt: string;
  version: '4.5' | '4.0';
  size: '1K' | '2K' | '4K';
  optimizationMode: 'standard' | 'quality' | 'speed';
  watermark: boolean;
}

interface UseSeedreamGenerationReturn {
  image: string | null;
  isLoading: boolean;
  error: string | null;
  progress: number;
  generateImage: (params: SeedreamParams) => Promise<void>;
  checkCredits: () => Promise<boolean>;
  userCredits: number | null;
  refreshCredits: () => Promise<void>;
}

// Credit cost mapping
const CREDIT_COSTS = {
  '1K': 10,
  '2K': 15,
  '4K': 25,
} as const;

// Size mapping
const SIZE_MAP = {
  '1K': '1024x1024',
  '2K': '2048x2048',
  '4K': '4096x4096',
} as const;

export function useSeedreamGeneration(): UseSeedreamGenerationReturn {
  const session = useSession();
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [userCredits, setUserCredits] = useState<number | null>(null);

  // Refresh user credits
  const refreshCredits = async () => {
    if (!session?.user?.id) {
      setUserCredits(null);
      return;
    }

    try {
      const result = await getUserCreditsAction(session.user.id);
      setUserCredits(result.success ? result.credits : null);
    } catch (err) {
      console.error('Failed to fetch user credits:', err);
      setUserCredits(null);
    }
  };

  // Check if user has enough credits
  const checkCredits = async (): Promise<boolean> => {
    if (!session?.user?.id) {
      setError('Please log in to generate images');
      return false;
    }

    // This will be called with specific size from generateImage
    // For now, return true if user has any credits
    await refreshCredits();
    return userCredits !== null && userCredits > 0;
  };

  // Generate image
  const generateImage = async (params: SeedreamParams) => {
    setError(null);
    setImage(null);
    setProgress(0);

    // 1. Check authentication
    if (!session?.user?.id) {
      setError('Please log in to generate images');
      return;
    }

    const userId = session.user.id;

    // 2. Calculate required credits
    const requiredCredits = CREDIT_COSTS[params.size];

    // 3. Check if user has enough credits
    setProgress(10);
    try {
      const result = await hasEnoughCreditsAction({
        userId,
        requiredCredits,
      });

      if (!result.success || !result.hasCredits) {
        setError(
          `Insufficient credits. You need ${requiredCredits} credits to generate a ${params.size} image.`
        );
        return;
      }
    } catch (err) {
      console.error('Credit check failed:', err);
      setError('Failed to check credits. Please try again.');
      return;
    }

    // 4. Prepare API request
    setProgress(20);
    setIsLoading(true);

    const request: GenerateImageRequest = {
      prompt: params.prompt,
      provider: 'replicate',
      modelId: 'bytedance/seedream-4.5',
      size: SIZE_MAP[params.size],
      // Watermark is currently not supported by the API endpoint
      // but we include it in params for future implementation
    };

    try {
      setProgress(30);

      // 5. Call generation API
      const response = await fetch('/api/generate-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      setProgress(70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const result = await response.json();
      setProgress(90);

      // 6. Deduct credits after successful generation
      const consumeResult = await consumeCreditsAction({
        userId,
        amount: requiredCredits,
        description: `Generated ${params.size} image with Seedream ${params.version}`,
      });

      if (!consumeResult.success) {
        console.error('Failed to consume credits after generation');
      }

      // 7. Update state
      setImage(result.image);
      setProgress(100);

      // 8. Refresh credits display
      await refreshCredits();
    } catch (err) {
      console.error('Image generation failed:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate image. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    image,
    isLoading,
    error,
    progress,
    generateImage,
    checkCredits,
    userCredits,
    refreshCredits,
  };
}
