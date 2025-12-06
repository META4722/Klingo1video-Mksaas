'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from '@/hooks/use-session';
import { useKlingGeneration } from '@/hooks/use-kling-generation';
import { cn } from '@/lib/utils';
import { Loader2, Sparkles, Upload, X, Zap } from 'lucide-react';
import { useLocaleRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { uploadFileFromBrowser } from '@/storage/client';
import Image from 'next/image';

interface KlingFormProps {
	onGenerationComplete?: (video: string) => void;
	onGenerationError?: (error: string) => void;
	onGenerationStart?: () => void;
}

type DurationOption = 5 | 10;

const CREDIT_COSTS: Record<DurationOption, number> = {
	5: 10,
	10: 20,
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function KlingForm({
	onGenerationComplete,
	onGenerationError,
	onGenerationStart,
}: KlingFormProps) {
	const t = useTranslations('HomePage.showcase');
	const session = useSession();
	const router = useLocaleRouter();
	const {
		generateVideo,
		isLoading,
		error,
		video,
		userCredits,
		refreshCredits,
	} = useKlingGeneration();

	// Form state
	const [prompt, setPrompt] = useState('');
	const [duration, setDuration] = useState<DurationOption>(5);
	const [firstFrameUrl, setFirstFrameUrl] = useState<string>('');
	const [lastFrameUrl, setLastFrameUrl] = useState<string>('');
	const [uploadingFirst, setUploadingFirst] = useState(false);
	const [uploadingLast, setUploadingLast] = useState(false);

	const firstFrameInputRef = useRef<HTMLInputElement>(null);
	const lastFrameInputRef = useRef<HTMLInputElement>(null);

	// Load user credits on mount
	useEffect(() => {
		if (session?.user?.id) {
			refreshCredits();
		}
	}, [session?.user?.id]);

	// Listen for example selection events
	useEffect(() => {
		const handleExampleSelected = (event: Event) => {
			const customEvent = event as CustomEvent<{ prompt: string }>;
			if (customEvent.detail?.prompt) {
				setPrompt(customEvent.detail.prompt);
			}
		};

		window.addEventListener('kling-example-selected', handleExampleSelected);
		return () => {
			window.removeEventListener(
				'kling-example-selected',
				handleExampleSelected,
			);
		};
	}, []);

	// Handle generation completion
	useEffect(() => {
		if (video) {
			onGenerationComplete?.(video);
		}
	}, [video]);

	// Handle generation error
	useEffect(() => {
		if (error) {
			onGenerationError?.(error);
		}
	}, [error]);

	const handleFileUpload = async (
		file: File,
		type: 'first' | 'last',
	): Promise<void> => {
		// Validate file type
		if (!ALLOWED_FILE_TYPES.includes(file.type)) {
			alert('Please upload a JPG, PNG, or WebP image');
			return;
		}

		// Validate file size
		if (file.size > MAX_FILE_SIZE) {
			alert('File size must be less than 10MB');
			return;
		}

		const setUploading = type === 'first' ? setUploadingFirst : setUploadingLast;
		const setUrl = type === 'first' ? setFirstFrameUrl : setLastFrameUrl;

		try {
			setUploading(true);
			const result = await uploadFileFromBrowser(file);
			setUrl(result.url);
		} catch (err) {
			console.error('File upload failed:', err);
			alert(
				err instanceof Error
					? err.message
					: 'Failed to upload image. Please try again.',
			);
		} finally {
			setUploading(false);
		}
	};

	const handleFirstFrameChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (file) {
			await handleFileUpload(file, 'first');
		}
	};

	const handleLastFrameChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (file) {
			await handleFileUpload(file, 'last');
		}
	};

	const handleGenerate = async () => {
		// Validate prompt
		if (!prompt.trim()) {
			return;
		}

		if (prompt.trim().length < 10) {
			return;
		}

		// Check authentication
		if (!session?.user) {
			router.push(
				'/auth/login?callbackUrl=' + encodeURIComponent('/#generation'),
			);
			return;
		}

		// Validate first frame upload
		if (!firstFrameUrl) {
			alert('Please upload at least the first frame image');
			return;
		}

		// Check credits
		const requiredCredits = CREDIT_COSTS[duration];
		if (userCredits !== null && userCredits < requiredCredits) {
			return;
		}

		// Prepare image URLs array
		const imageUrls = [firstFrameUrl];
		if (lastFrameUrl) {
			imageUrls.push(lastFrameUrl);
		}

		// Start generation
		onGenerationStart?.();
		await generateVideo({
			prompt,
			imageUrls,
			duration,
		});
	};

	const isFormValid =
		prompt.trim().length >= 10 &&
		prompt.trim().length <= 5000 &&
		firstFrameUrl;
	const requiredCredits = CREDIT_COSTS[duration];

	return (
		<div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 space-y-6 h-full flex flex-col">
			{/* Header with credits */}
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">{t('form.promptLabel')}</h3>
				{session?.user && userCredits !== null && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Zap className="size-4 text-yellow-500" />
						<span>{userCredits} Credits</span>
					</div>
				)}
			</div>

			{/* Prompt Input */}
			<div className="space-y-2 flex-1">
				<Textarea
					placeholder={t('form.promptPlaceholder')}
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					className="min-h-[120px] resize-none"
					maxLength={5000}
				/>
				<div className="flex items-center justify-between text-xs text-muted-foreground">
					<span>{t('form.promptHint')}</span>
					<span>{prompt.length}/5000</span>
				</div>
			</div>

			{/* First Frame Upload */}
			<div className="space-y-2">
				<Label>{t('form.firstFrame')}</Label>
				<input
					ref={firstFrameInputRef}
					type="file"
					accept="image/jpeg,image/png,image/webp"
					onChange={handleFirstFrameChange}
					className="hidden"
				/>
				{firstFrameUrl ? (
					<div className="relative border-2 border-border rounded-lg overflow-hidden">
						<Image
							src={firstFrameUrl}
							alt="First frame"
							width={400}
							height={300}
							className="w-full h-48 object-cover"
						/>
						<button
							type="button"
							onClick={() => setFirstFrameUrl('')}
							className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 hover:bg-destructive/90"
						>
							<X className="size-4" />
						</button>
					</div>
				) : (
					<button
						type="button"
						onClick={() => firstFrameInputRef.current?.click()}
						disabled={uploadingFirst}
						className={cn(
							'w-full border-2 border-dashed border-border rounded-lg p-8',
							'flex flex-col items-center justify-center gap-2',
							'text-muted-foreground hover:border-primary hover:text-primary transition-colors',
							uploadingFirst && 'cursor-not-allowed opacity-50',
						)}
					>
						{uploadingFirst ? (
							<Loader2 className="size-8 animate-spin" />
						) : (
							<Upload className="size-8" />
						)}
						<p className="text-sm font-medium">{t('form.uploadFirstFrame')}</p>
						<p className="text-xs">{t('form.uploadHint')}</p>
					</button>
				)}
			</div>

			{/* Last Frame Upload (Optional) */}
			<div className="space-y-2">
				<Label>{t('form.lastFrame')}</Label>
				<input
					ref={lastFrameInputRef}
					type="file"
					accept="image/jpeg,image/png,image/webp"
					onChange={handleLastFrameChange}
					className="hidden"
				/>
				{lastFrameUrl ? (
					<div className="relative border-2 border-border rounded-lg overflow-hidden">
						<Image
							src={lastFrameUrl}
							alt="Last frame"
							width={400}
							height={300}
							className="w-full h-48 object-cover"
						/>
						<button
							type="button"
							onClick={() => setLastFrameUrl('')}
							className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 hover:bg-destructive/90"
						>
							<X className="size-4" />
						</button>
					</div>
				) : (
					<button
						type="button"
						onClick={() => lastFrameInputRef.current?.click()}
						disabled={uploadingLast}
						className={cn(
							'w-full border-2 border-dashed border-border rounded-lg p-8',
							'flex flex-col items-center justify-center gap-2',
							'text-muted-foreground hover:border-primary hover:text-primary transition-colors',
							uploadingLast && 'cursor-not-allowed opacity-50',
						)}
					>
						{uploadingLast ? (
							<Loader2 className="size-8 animate-spin" />
						) : (
							<Upload className="size-8" />
						)}
						<p className="text-sm font-medium">{t('form.uploadLastFrame')}</p>
						<p className="text-xs">{t('form.uploadHint')}</p>
					</button>
				)}
			</div>

			{/* Duration Selector */}
			<div className="space-y-2">
				<Label>{t('form.duration')}</Label>
				<div className="grid grid-cols-2 gap-2">
					<Button
						type="button"
						variant={duration === 5 ? 'default' : 'outline'}
						onClick={() => setDuration(5)}
						className="flex flex-col h-auto py-3"
					>
						<span className="font-semibold">{t('form.duration5s')}</span>
						<span className="text-xs opacity-80">
							{CREDIT_COSTS[5]} {t('form.creditCost')}
						</span>
					</Button>
					<Button
						type="button"
						variant={duration === 10 ? 'default' : 'outline'}
						onClick={() => setDuration(10)}
						className="flex flex-col h-auto py-3"
					>
						<span className="font-semibold">{t('form.duration10s')}</span>
						<span className="text-xs opacity-80">
							{CREDIT_COSTS[10]} {t('form.creditCost')}
						</span>
					</Button>
				</div>
			</div>

			{/* Generate Button */}
			<Button
				onClick={handleGenerate}
				disabled={isLoading || !isFormValid}
				className="w-full gap-2"
				size="lg"
			>
				{isLoading ? (
					<>
						<Loader2 className="size-4 animate-spin" />
						Generating...
					</>
				) : (
					<>
						<Sparkles className="size-4" />
						{t('form.generate')} ({requiredCredits} {t('form.creditCost')})
					</>
				)}
			</Button>

			{/* Validation hints */}
			{!session?.user ? (
				<p className="text-xs text-center text-muted-foreground">
					Please log in to generate videos
				</p>
			) : !firstFrameUrl ? (
				<p className="text-xs text-center text-orange-500">
					Please upload at least the first frame image
				</p>
			) : !isFormValid && prompt.trim().length > 0 ? (
				<p className="text-xs text-center text-orange-500">
					Prompt must be at least 10 characters
				</p>
			) : userCredits !== null && userCredits < requiredCredits ? (
				<p className="text-xs text-center text-orange-500">
					Insufficient credits ({userCredits}/{requiredCredits})
				</p>
			) : null}
		</div>
	);
}
