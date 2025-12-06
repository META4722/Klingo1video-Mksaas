'use client';

import {
	consumeCreditsAction,
	getUserCreditsAction,
	hasEnoughCreditsAction,
} from '@/actions/credits';
import { useSession } from '@/hooks/use-session';
import { useState } from 'react';

interface KlingParams {
	prompt: string;
	imageUrls: string[]; // 1-2 URLs for first frame and optional last frame
	duration: 5 | 10;
}

interface UseKlingGenerationReturn {
	video: string | null;
	isLoading: boolean;
	error: string | null;
	progress: number;
	generateVideo: (params: KlingParams) => Promise<void>;
	checkCredits: () => Promise<boolean>;
	userCredits: number | null;
	refreshCredits: () => Promise<void>;
}

// Credit cost mapping based on duration
const CREDIT_COSTS = {
	5: 10, // 5 seconds = 10 credits
	10: 20, // 10 seconds = 20 credits
} as const;

export function useKlingGeneration(): UseKlingGenerationReturn {
	const session = useSession();
	const [video, setVideo] = useState<string | null>(null);
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
			setError('Please log in to generate videos');
			return false;
		}

		await refreshCredits();
		return userCredits !== null && userCredits > 0;
	};

	// Generate video
	const generateVideo = async (params: KlingParams) => {
		setError(null);
		setVideo(null);
		setProgress(0);

		// 1. Check authentication
		if (!session?.user?.id) {
			setError('Please log in to generate videos');
			return;
		}

		const userId = session.user.id;

		// 2. Validate image URLs
		if (!params.imageUrls || params.imageUrls.length === 0) {
			setError('Please upload at least one image (first frame)');
			return;
		}

		if (params.imageUrls.length > 2) {
			setError('Maximum 2 images allowed (first frame and optional last frame)');
			return;
		}

		// 3. Calculate required credits
		const requiredCredits = CREDIT_COSTS[params.duration];

		// 4. Check if user has enough credits
		setProgress(10);
		try {
			const result = await hasEnoughCreditsAction({
				userId,
				requiredCredits,
			});

			if (!result.success || !result.hasCredits) {
				setError(
					`Insufficient credits. You need ${requiredCredits} credits to generate a ${params.duration}s video.`,
				);
				return;
			}
		} catch (err) {
			console.error('Credit check failed:', err);
			setError('Failed to check credits. Please try again.');
			return;
		}

		// 5. Prepare API request
		setProgress(20);
		setIsLoading(true);

		try {
			setProgress(30);

			// 6. Call video generation API
			const response = await fetch('/api/generate-video', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					prompt: params.prompt,
					image_urls: params.imageUrls,
					duration: params.duration,
				}),
			});

			setProgress(70);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to generate video');
			}

			const result = await response.json();
			setProgress(90);

			if (!result.video_url) {
				throw new Error('No video URL returned from API');
			}

			// 7. Deduct credits after successful generation
			const consumeResult = await consumeCreditsAction({
				userId,
				amount: requiredCredits,
				description: `Generated ${params.duration}s video with Kling O1`,
			});

			if (!consumeResult.success) {
				console.error('Failed to consume credits after generation');
			}

			// 8. Update state
			setVideo(result.video_url);
			setProgress(100);

			// 9. Refresh credits display
			await refreshCredits();
		} catch (err) {
			console.error('Video generation failed:', err);
			setError(
				err instanceof Error
					? err.message
					: 'Failed to generate video. Please try again.',
			);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		video,
		isLoading,
		error,
		progress,
		generateVideo,
		checkCredits,
		userCredits,
		refreshCredits,
	};
}
