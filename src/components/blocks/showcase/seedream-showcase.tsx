'use client';

import { useSeedreamGeneration } from '@/hooks/use-seedream-generation';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { SeedreamForm } from './seedream-form';
import { SeedreamResults } from './seedream-results';

export default function SeedreamShowcase() {
  const t = useTranslations('HomePage.showcase');
  const { image, isLoading, error } = useSeedreamGeneration();
  const [currentPrompt, setCurrentPrompt] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const handleGenerationStart = () => {
    // Could add any pre-generation logic here
  };

  const handleGenerationComplete = (generatedImage: string) => {
    // Could add any post-generation logic here
    console.log('Image generated successfully');
  };

  const handleGenerationError = (errorMessage: string) => {
    // Could add any error handling logic here
    console.error('Generation error:', errorMessage);
  };

  const handleRetry = () => {
    // Scroll to form if needed
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExampleClick = (examplePrompt: string) => {
    // This will be handled by the form component via a custom event
    // or we could lift the prompt state up here
    const event = new CustomEvent('seedream-example-selected', {
      detail: { prompt: examplePrompt },
    });
    window.dispatchEvent(event);
  };

  return (
    <section id="generation" className="relative py-12 sm:py-16 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t('title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          {/* Two-column grid */}
          <div
            ref={formRef}
            className="grid gap-6 lg:grid-cols-[2fr_3fr] items-start"
          >
            {/* Left Panel - Form */}
            <div className="order-2 lg:order-1">
              <SeedreamForm
                onGenerationStart={handleGenerationStart}
                onGenerationComplete={handleGenerationComplete}
                onGenerationError={handleGenerationError}
              />
            </div>

            {/* Right Panel - Results */}
            <div className="order-1 lg:order-2">
              <SeedreamResults
                image={image}
                isLoading={isLoading}
                error={error}
                prompt={currentPrompt}
                onRetry={handleRetry}
                onExampleClick={handleExampleClick}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
