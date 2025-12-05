'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSession } from '@/hooks/use-session';
import { useSeedreamGeneration } from '@/hooks/use-seedream-generation';
import { cn } from '@/lib/utils';
import { Info, Loader2, Sparkles, Upload, Zap } from 'lucide-react';
import { useLocaleRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface SeedreamFormProps {
  onGenerationComplete?: (image: string) => void;
  onGenerationError?: (error: string) => void;
  onGenerationStart?: () => void;
}

type SizeOption = '1K' | '2K' | '4K';
type VersionOption = '4.5' | '4.0';
type OptimizationMode = 'standard' | 'quality' | 'speed';

const CREDIT_COSTS: Record<SizeOption, number> = {
  '1K': 10,
  '2K': 15,
  '4K': 25,
};

export function SeedreamForm({
  onGenerationComplete,
  onGenerationError,
  onGenerationStart,
}: SeedreamFormProps) {
  const t = useTranslations('HomePage.showcase');
  const session = useSession();
  const router = useLocaleRouter();
  const {
    generateImage,
    isLoading,
    error,
    image,
    userCredits,
    refreshCredits,
  } = useSeedreamGeneration();

  // Form state
  const [prompt, setPrompt] = useState('');
  const [version, setVersion] = useState<VersionOption>('4.5');
  const [size, setSize] = useState<SizeOption>('1K');
  const [optimizationMode, setOptimizationMode] =
    useState<OptimizationMode>('standard');
  const [watermark, setWatermark] = useState(false);

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

    window.addEventListener('seedream-example-selected', handleExampleSelected);
    return () => {
      window.removeEventListener(
        'seedream-example-selected',
        handleExampleSelected
      );
    };
  }, []);

  // Handle generation completion
  useEffect(() => {
    if (image) {
      onGenerationComplete?.(image);
    }
  }, [image]);

  // Handle generation error
  useEffect(() => {
    if (error) {
      onGenerationError?.(error);
    }
  }, [error]);

  const handleGenerate = async () => {
    // Validate prompt
    if (!prompt.trim()) {
      onGenerationError?.('Please enter a prompt to generate an image');
      return;
    }

    if (prompt.trim().length < 10) {
      onGenerationError?.(
        'Prompt must be at least 10 characters long. Please describe your image in more detail.'
      );
      return;
    }

    // Check authentication
    if (!session?.user) {
      // Redirect to login with callback to homepage generation section
      router.push(
        '/auth/login?callbackUrl=' + encodeURIComponent('/#generation')
      );
      return;
    }

    // Check credits
    const requiredCredits = CREDIT_COSTS[size];
    if (userCredits !== null && userCredits < requiredCredits) {
      onGenerationError?.(
        `Insufficient credits. You need ${requiredCredits} credits but only have ${userCredits}. Please purchase more credits.`
      );
      return;
    }

    // Start generation
    onGenerationStart?.();
    await generateImage({
      prompt,
      version,
      size,
      optimizationMode,
      watermark,
    });
  };

  const isFormValid =
    prompt.trim().length >= 10 && prompt.trim().length <= 5000;
  const requiredCredits = CREDIT_COSTS[size];

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

      {/* Version Selector */}
      <div className="space-y-2">
        <Label>{t('form.version')}</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={version === '4.0' ? 'default' : 'outline'}
            onClick={() => setVersion('4.0')}
            className="flex-1"
          >
            Seedream 4.0
          </Button>
          <Button
            type="button"
            variant={version === '4.5' ? 'default' : 'outline'}
            onClick={() => setVersion('4.5')}
            className="flex-1 gap-2"
          >
            Seedream 4.5
            <Sparkles className="size-4" />
          </Button>
        </div>
      </div>

      {/* Reference Image Upload (UI only - disabled) */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          {t('form.referenceImage')}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="size-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">Coming Soon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <div
          className={cn(
            'border-2 border-dashed border-border rounded-lg p-8',
            'flex flex-col items-center justify-center gap-2',
            'text-muted-foreground cursor-not-allowed opacity-50'
          )}
        >
          <Upload className="size-8" />
          <p className="text-sm">{t('form.referenceImage')}</p>
          <p className="text-xs">{t('form.referenceImageHint')}</p>
        </div>
      </div>

      {/* Size Selector */}
      <div className="space-y-2">
        <Label>{t('form.size')}</Label>
        <div className="grid grid-cols-3 gap-2">
          {(['1K', '2K', '4K'] as const).map((sizeOption) => (
            <Button
              key={sizeOption}
              type="button"
              variant={size === sizeOption ? 'default' : 'outline'}
              onClick={() => setSize(sizeOption)}
              className="flex flex-col h-auto py-3"
            >
              <span className="font-semibold">{sizeOption}</span>
              <span className="text-xs opacity-80">
                {CREDIT_COSTS[sizeOption]}{' '}
                {t('form.creditCost', { cost: '' }).trim()}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Optimization Mode */}
      <div className="space-y-2">
        <Label>{t('form.optimization')}</Label>
        <Select
          value={optimizationMode}
          onValueChange={(value) =>
            setOptimizationMode(value as OptimizationMode)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="quality">Quality</SelectItem>
            <SelectItem value="speed">Speed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Watermark Toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>{t('form.watermark')}</Label>
          <p className="text-xs text-muted-foreground">
            {t('form.watermarkDesc')}
          </p>
        </div>
        <Switch checked={watermark} onCheckedChange={setWatermark} />
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isLoading}
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
            {t('form.generate')} ({requiredCredits}{' '}
            {t('form.creditCost', { cost: '' }).trim()})
          </>
        )}
      </Button>

      {/* Validation hints */}
      {!session?.user ? (
        <p className="text-xs text-center text-muted-foreground">
          Please log in to generate images
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
