'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Loader2,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

interface SeedreamResultsProps {
  image: string | null;
  isLoading: boolean;
  error: string | null;
  prompt?: string;
  onRetry?: () => void;
  onExampleClick?: (prompt: string) => void;
}

// Example images with prompts
const EXAMPLE_IMAGES = [
  {
    url: 'https://placehold.co/600x600/1a1a1a/white/png?text=Neon+Cyberpunk',
    prompt:
      'Neon cyberpunk street at night with rain reflections, glowing signs, and futuristic architecture',
  },
  {
    url: 'https://placehold.co/600x600/f5f5f0/666/png?text=Cozy+Interior',
    prompt:
      'Cozy minimalist living room with warm sunlight, natural textures, and indoor plants',
  },
  {
    url: 'https://placehold.co/600x600/ff6b9d/fff/png?text=Anime+Skyline',
    prompt:
      'Futuristic anime skyline at dusk with vibrant colors and detailed clouds',
  },
];

export function SeedreamResults({
  image,
  isLoading,
  error,
  prompt,
  onRetry,
  onExampleClick,
}: SeedreamResultsProps) {
  const t = useTranslations('HomePage.showcase');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleDownload = () => {
    if (!image) return;

    const link = document.createElement('a');
    link.href = `data:image/png;base64,${image}`;
    link.download = `seedream-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPrompt = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
  };

  const handleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const nextExample = () => {
    setCarouselIndex((prev) => (prev + 1) % EXAMPLE_IMAGES.length);
  };

  const prevExample = () => {
    setCarouselIndex(
      (prev) => (prev - 1 + EXAMPLE_IMAGES.length) % EXAMPLE_IMAGES.length
    );
  };

  const handleExampleClick = () => {
    const example = EXAMPLE_IMAGES[carouselIndex];
    onExampleClick?.(example.prompt);
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 space-y-6 h-full flex flex-col">
      {/* Main Display Area */}
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center gap-4 w-full">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              <span>{t('results.generating')}</span>
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

        {/* Success State - Generated Image */}
        {!isLoading && !error && image && (
          <div className="w-full space-y-4">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-border">
              <Image
                src={`data:image/png;base64,${image}`}
                alt="Generated image"
                fill
                className="object-contain"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center">
              <Button
                onClick={handleZoom}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Maximize2 className="size-4" />
                {t('results.zoom')}
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
        {!isLoading && !error && !image && (
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
                className="relative w-full aspect-square rounded-lg overflow-hidden border border-border cursor-pointer group"
                onClick={handleExampleClick}
              >
                <Image
                  src={EXAMPLE_IMAGES[carouselIndex].url}
                  alt="Example image"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
                  <p className="text-white text-sm text-center">
                    {EXAMPLE_IMAGES[carouselIndex].prompt}
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
                  {EXAMPLE_IMAGES.map((_, index) => (
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

      {/* Zoom Modal */}
      {isZoomed && image && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={handleZoom}
        >
          <div className="relative max-w-7xl max-h-full">
            <Image
              src={`data:image/png;base64,${image}`}
              alt="Generated image (zoomed)"
              width={2048}
              height={2048}
              className="object-contain max-h-[90vh]"
            />
            <Button
              onClick={handleZoom}
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
