'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Eye,
  Loader2,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

interface KlingResultsProps {
  video: string | null; // Changed from image to video
  isLoading: boolean;
  error: string | null;
  prompt?: string;
  progress?: number; // Add progress prop
  onRetry?: () => void;
  onExampleClick?: (prompt: string) => void;
}

// Example video placeholders
const EXAMPLE_VIDEOS = [
  {
    url: 'https://placehold.co/600x600/1a1a1a/white/png?text=Cyberpunk+City',
    prompt:
      'A neon-lit cyberpunk cityscape at night with flying cars, holographic advertisements, and bustling streets',
  },
  {
    url: 'https://placehold.co/600x600/f5f5f0/666/png?text=Ocean+Waves',
    prompt:
      'Peaceful ocean waves gently lapping on a sandy beach during golden hour sunset',
  },
  {
    url: 'https://placehold.co/600x600/ff6b9d/fff/png?text=Fantasy+Forest',
    prompt:
      'Magical forest with glowing mushrooms, fireflies, and ethereal mist flowing between ancient trees',
  },
];

export function KlingResults({
  video,
  isLoading,
  error,
  prompt,
  progress = 0,
  onRetry,
  onExampleClick,
}: KlingResultsProps) {
  const t = useTranslations('HomePage.showcase');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDownload = async () => {
    if (!video) return;

    try {
      const response = await fetch(video);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kling-o1-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleCopyPrompt = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const nextExample = () => {
    setCarouselIndex((prev) => (prev + 1) % EXAMPLE_VIDEOS.length);
  };

  const prevExample = () => {
    setCarouselIndex(
      (prev) => (prev - 1 + EXAMPLE_VIDEOS.length) % EXAMPLE_VIDEOS.length
    );
  };

  const handleExampleClick = () => {
    const example = EXAMPLE_VIDEOS[carouselIndex];
    onExampleClick?.(example.prompt);
  };

  const getProgressMessage = (progress: number) => {
    if (progress < 30) return 'Analyzing prompt...';
    if (progress < 60) return 'Generating keyframes...';
    if (progress < 90) return 'Creating video...';
    return 'Finalizing video...';
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 space-y-6 h-full flex flex-col">
      {/* Main Display Area */}
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center gap-4 w-full">
            <Skeleton className="w-full aspect-video rounded-lg" />
            <div className="w-full space-y-3">
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-700 dark:text-blue-300 text-center font-medium">
                  ⏱️ Video generation typically takes 2-3 minutes
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 text-center mt-1">
                  Please keep this page open and wait for completion
                </p>
              </div>
              <Progress value={progress} className="w-full" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                <Loader2 className="size-4 animate-spin" />
                <span>{getProgressMessage(progress)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <RefreshCw className="size-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <p className="font-medium text-destructive">
                {t('results.error')}
              </p>
              <p className="text-sm text-muted-foreground max-w-sm">{error}</p>
            </div>
            {onRetry && (
              <Button onClick={onRetry} variant="outline" className="gap-2">
                <RefreshCw className="size-4" />
                {t('results.tryAgain')}
              </Button>
            )}
          </div>
        )}

        {/* Success State - Generated Video */}
        {!isLoading && !error && video && (
          <div className="w-full space-y-4">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-black">
              <video
                src={video}
                controls
                className="w-full h-full"
                autoPlay
                loop
                muted
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center flex-wrap">
              <Button
                onClick={handleFullscreen}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Eye className="size-4" />
                View
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Download className="size-4" />
                {t('results.download')}
              </Button>
              {prompt && (
                <Button
                  onClick={handleCopyPrompt}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Copy className="size-4" />
                  {t('results.copyPrompt')}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Idle State - Show Examples */}
        {!isLoading && !error && !video && (
          <div className="w-full space-y-4">
            <div className="text-center space-y-2">
              <h4 className="font-medium">{t('results.examples')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('results.examplesHint')}
              </p>
            </div>

            {/* Example Carousel */}
            <div className="relative">
              <div
                className="relative w-full aspect-video rounded-lg overflow-hidden border border-border cursor-pointer group"
                onClick={handleExampleClick}
              >
                <Image
                  src={EXAMPLE_VIDEOS[carouselIndex].url}
                  alt="Example video thumbnail"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
                  <p className="text-white text-sm text-center">
                    {EXAMPLE_VIDEOS[carouselIndex].prompt}
                  </p>
                </div>
              </div>

              {/* Carousel Navigation */}
              <div className="flex items-center justify-between mt-4">
                <Button
                  onClick={prevExample}
                  variant="outline"
                  size="icon"
                  className="size-8"
                >
                  <ChevronLeft className="size-4" />
                </Button>

                {/* Dots indicator */}
                <div className="flex gap-2">
                  {EXAMPLE_VIDEOS.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCarouselIndex(index)}
                      className={cn(
                        'size-2 rounded-full transition-all',
                        index === carouselIndex
                          ? 'bg-primary w-4'
                          : 'bg-muted-foreground/30'
                      )}
                      aria-label={`Go to example ${index + 1}`}
                    />
                  ))}
                </div>

                <Button
                  onClick={nextExample}
                  variant="outline"
                  size="icon"
                  className="size-8"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && video && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={handleFullscreen}
        >
          <div className="relative max-w-7xl max-h-full w-full">
            <video
              src={video}
              controls
              className="w-full h-auto max-h-[90vh]"
              autoPlay
            />
            <Button
              onClick={handleFullscreen}
              variant="outline"
              size="icon"
              className="absolute top-4 right-4"
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
