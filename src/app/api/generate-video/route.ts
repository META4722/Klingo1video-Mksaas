import { type NextRequest, NextResponse } from 'next/server';

/**
 * Maximum execution time for video generation requests
 * Videos can take longer than images, so we allow up to 2 minutes
 */
const TIMEOUT_MILLIS = 120 * 1000; // 2 minutes

/**
 * Polling interval for checking video generation status
 */
const POLL_INTERVAL_MS = 3000; // 3 seconds

interface GenerateVideoRequest {
	prompt: string;
	image_urls: string[]; // 1-2 URLs for first frame and optional last frame
	duration: 5 | 10; // Video duration in seconds
}

interface EvolinkVideoRequest {
	model: 'kling-o1-image-to-video';
	prompt: string;
	image_urls: string[];
	duration: number;
}

interface EvolinkVideoResponse {
	id?: string; // Job ID if async
	video_url?: string; // Direct video URL if sync
	status?: 'pending' | 'processing' | 'completed' | 'failed';
	error?: string;
}

const withTimeout = <T>(
	promise: Promise<T>,
	timeoutMillis: number,
): Promise<T> => {
	return Promise.race([
		promise,
		new Promise<T>((_, reject) =>
			setTimeout(() => reject(new Error('Request timed out')), timeoutMillis),
		),
	]);
};

/**
 * Poll for video generation completion
 */
async function pollVideoStatus(
	jobId: string,
	apiKey: string,
	maxAttempts = 40,
): Promise<string> {
	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

		const statusResponse = await fetch(
			`https://api.evolink.ai/v1/videos/generations/${jobId}`,
			{
				headers: {
					Authorization: `Bearer ${apiKey}`,
				},
			},
		);

		if (!statusResponse.ok) {
			throw new Error('Failed to check video generation status');
		}

		const statusData = (await statusResponse.json()) as EvolinkVideoResponse;

		if (statusData.status === 'completed' && statusData.video_url) {
			return statusData.video_url;
		}

		if (statusData.status === 'failed') {
			throw new Error(statusData.error || 'Video generation failed');
		}

		// Continue polling if status is 'pending' or 'processing'
	}

	throw new Error('Video generation timed out after polling');
}

export async function POST(req: NextRequest) {
	const requestId = Math.random().toString(36).substring(7);

	try {
		const { prompt, image_urls, duration } =
			(await req.json()) as GenerateVideoRequest;

		// Validate request
		if (!prompt || !image_urls || !duration) {
			const error = 'Missing required parameters: prompt, image_urls, or duration';
			console.error(`${error} [requestId=${requestId}]`);
			return NextResponse.json({ error }, { status: 400 });
		}

		if (image_urls.length === 0 || image_urls.length > 2) {
			const error = 'image_urls must contain 1 or 2 URLs';
			console.error(`${error} [requestId=${requestId}]`);
			return NextResponse.json({ error }, { status: 400 });
		}

		if (duration !== 5 && duration !== 10) {
			const error = 'duration must be 5 or 10 seconds';
			console.error(`${error} [requestId=${requestId}]`);
			return NextResponse.json({ error }, { status: 400 });
		}

		const apiKey = process.env.EVOLINK_API_KEY;
		if (!apiKey) {
			const error = 'EVOLINK_API_KEY not configured';
			console.error(`${error} [requestId=${requestId}]`);
			return NextResponse.json({ error: 'Service configuration error' }, { status: 500 });
		}

		const startTime = performance.now();
		console.log(
			`Starting video generation [requestId=${requestId}, duration=${duration}s, frames=${image_urls.length}]`,
		);

		// Prepare Evolink API request
		const evolinkRequest: EvolinkVideoRequest = {
			model: 'kling-o1-image-to-video',
			prompt,
			image_urls,
			duration,
		};

		// Call Evolink API
		const generatePromise = fetch(
			'https://api.evolink.ai/v1/videos/generations',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${apiKey}`,
				},
				body: JSON.stringify(evolinkRequest),
			},
		)
			.then(async (response) => {
				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(
						errorData.error || `API request failed with status ${response.status}`,
					);
				}
				return response.json() as Promise<EvolinkVideoResponse>;
			})
			.then(async (data) => {
				// Check if response contains video URL directly
				if (data.video_url) {
					console.log(
						`Video generation completed [requestId=${requestId}, elapsed=${((performance.now() - startTime) / 1000).toFixed(1)}s]`,
					);
					return data.video_url;
				}

				// If we get a job ID, poll for completion
				if (data.id) {
					console.log(
						`Video generation started, polling for completion [requestId=${requestId}, jobId=${data.id}]`,
					);
					return pollVideoStatus(data.id, apiKey);
				}

				throw new Error('Unexpected API response format');
			});

		const videoUrl = await withTimeout(generatePromise, TIMEOUT_MILLIS);

		console.log(
			`Video generation successful [requestId=${requestId}, elapsed=${((performance.now() - startTime) / 1000).toFixed(1)}s]`,
		);

		return NextResponse.json({ video_url: videoUrl });
	} catch (error) {
		console.error(
			`Error generating video [requestId=${requestId}]:`,
			error,
		);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: 'Failed to generate video. Please try again later.',
			},
			{ status: 500 },
		);
	}
}
