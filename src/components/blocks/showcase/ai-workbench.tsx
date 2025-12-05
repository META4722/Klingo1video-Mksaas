'use client';

import { Button } from '@/components/ui/button';
import { useSession } from '@/hooks/use-session';
import { useLocaleRouter } from '@/i18n/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Coins,
  Image as ImageIcon,
  Sparkles,
  Upload,
  WandSparkles,
  Zap,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

const showcaseImages = [
  {
    id: 1,
    title: 'Real-world Knowledge',
    description:
      'Use deep reasoning to deliver precise, detailed image results. Annotate pictures, turn handwritten notes into diagrams, or build infographics.',
    image: 'https://assets.seedream45.org/nano2-showcase/knowledge.jpg',
  },
  {
    id: 2,
    title: 'Clear Text Generation',
    description:
      'Sharp, legible text for posters, diagrams, and product mockups. Control fonts or simulate handwriting with high fidelity.',
    image: 'https://assets.seedream45.org/nano2-showcase/text-quality.jpg',
  },
  {
    id: 3,
    title: 'Perfect Style Transfer',
    description:
      'Capture and transfer artistic styles—oil painting, watercolor, illustration, or photography—consistently onto your creations.',
    image: 'https://assets.seedream45.org/nano2-showcase/sketches.jpg',
  },
  {
    id: 4,
    title: '4K Ultra Resolution',
    description:
      'Up to 4K ultra-high resolution with crystal-clear detail for professional print and commercial use.',
    image: 'https://assets.seedream45.org/nano2-showcase/text-to-4k.png',
  },
];

export default function AIWorkbenchShowcase() {
  const t = useTranslations('HomePage.showcase');
  const router = useLocaleRouter();
  const session = useSession();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<'edit' | 'generate'>('edit');

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % showcaseImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + showcaseImages.length) % showcaseImages.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleStartGeneration = () => {
    if (session?.user) {
      // User is logged in, go to creation page
      router.push('/creation');
    } else {
      // User is not logged in, redirect to login page
      router.push('/auth/login');
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Seedream 4.5 AI Creation Workbench
          </h2>
          <p className="hidden md:block text-lg text-muted-foreground">
            Use advanced AI technology to transform your imagination into
            beautiful images
          </p>
        </div>

        {/* Main Content */}
        <div className="w-full h-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] gap-4 h-full min-h-[700px] py-4 px-0 lg:px-4">
            {/* Left Panel - Operation Panel */}
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl shadow-xl">
              <div className="h-full overflow-y-auto p-1">
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    {/* Tab Switcher */}
                    <div className="space-y-3">
                      <div className="relative bg-muted rounded-lg p-1">
                        <div className="grid grid-cols-2">
                          <button
                            onClick={() => setActiveTab('edit')}
                            className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                              activeTab === 'edit'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <ImageIcon className="h-4 w-4 inline mr-2" />
                            Image Edit
                          </button>
                          <button
                            onClick={() => setActiveTab('generate')}
                            className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                              activeTab === 'generate'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <Sparkles className="h-4 w-4 inline mr-2" />
                            Text-to-Image
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Model Selection */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-foreground">
                          Select Model
                        </label>
                        <a
                          href="/#pricing"
                          className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm hover:shadow-md"
                        >
                          Compare →
                        </a>
                      </div>
                      <div className="relative">
                        <div className="w-full rounded-lg border px-4 py-3 text-left transition-all flex items-center gap-3 border-border bg-card hover:border-primary/40 shadow-xs cursor-pointer">
                          <div className="p-2.5 rounded-lg flex-shrink-0 bg-primary/10">
                            <Sparkles className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-base text-foreground truncate">
                                Seedream 4.5
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-green-400 px-2 py-0.5 text-[10px] font-semibold text-slate-900 shadow-sm">
                                New
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground block truncate">
                              Professional version with higher resolution
                              support
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reference Images */}
                    {activeTab === 'edit' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-foreground">
                            Reference Images
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <button
                            type="button"
                            className="aspect-square rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 group border-primary/30 hover:border-primary hover:bg-primary/5"
                          >
                            <div className="p-3 rounded-full transition-all duration-300 bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110">
                              <Upload className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-12" />
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-medium text-primary group-hover:text-primary/80">
                                Add Image
                              </p>
                              <p className="text-[10px] text-primary/70">
                                JPG, PNG, WebP
                              </p>
                              <p className="text-[10px] text-primary/70">
                                Max 10MB
                              </p>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Prompt Input */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">
                          Describe your{' '}
                          {activeTab === 'edit' ? 'edit' : 'image'}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          0/5000
                        </span>
                      </div>
                      <textarea
                        placeholder="Describe the effect you want, including style, color, composition and other details..."
                        className="flex w-full border px-3 py-2 text-base ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[120px] max-h-[300px] resize-y bg-background/50 border-input focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-200 placeholder:text-muted-foreground text-foreground"
                      />
                      <div className="text-xs text-muted-foreground">
                        Detailed descriptions lead to better results
                      </div>
                    </div>

                    {/* Quality Selection */}
                    <div className="space-y-2 relative">
                      <label className="text-sm font-medium text-foreground">
                        Quality
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          className="relative flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-sm transition-colors border-border hover:border-primary/40"
                        >
                          <span className="font-semibold text-foreground">
                            1K
                          </span>
                        </button>
                        <button
                          type="button"
                          className="relative flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-sm transition-colors border-primary bg-primary/10"
                        >
                          <span className="font-semibold text-foreground">
                            2K
                          </span>
                        </button>
                        <button
                          type="button"
                          className="relative flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-sm transition-colors border-border hover:border-primary/40 opacity-60"
                        >
                          <span className="font-semibold text-foreground">
                            4K
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Credit Cost */}
                    <div className="flex items-center justify-between px-3 py-2 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-foreground">
                          Credit Cost
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-primary">
                          15
                        </span>
                        <span className="text-sm text-muted-foreground">
                          credits
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-6 pt-4">
                    <Button
                      onClick={handleStartGeneration}
                      className="w-full h-12 text-base font-bold shadow-lg shadow-primary/25 transition-all duration-300"
                    >
                      <WandSparkles className="h-5 w-5 mr-2" />
                      Start {activeTab === 'edit' ? 'Edit' : 'Generation'}
                      <span className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium ml-2 bg-white/20 text-white border-0">
                        <Coins className="h-3 w-3 mr-1" />
                        15
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Showcase */}
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl shadow-xl">
              <div className="h-full">
                <div className="h-full flex flex-col items-center px-4 py-3">
                  <div className="w-full max-w-6xl space-y-6">
                    {/* Badge */}
                    <div className="text-center space-y-4 mb-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary shadow-lg shadow-primary/25">
                        <Zap className="h-3.5 w-3.5 text-primary-foreground animate-pulse" />
                        <span className="text-xs font-bold text-primary-foreground uppercase tracking-wider">
                          New Release! Seedream 4.5
                        </span>
                      </div>
                    </div>

                    {/* Carousel */}
                    <div className="relative">
                      <div className="overflow-hidden rounded-xl">
                        <div
                          className="flex transition-transform duration-500 ease-in-out"
                          style={{
                            transform: `translateX(-${currentSlide * 100}%)`,
                          }}
                        >
                          {showcaseImages.map((item) => (
                            <div key={item.id} className="min-w-full">
                              <div className="relative rounded-xl overflow-hidden bg-muted shadow-lg h-[320px] md:h-[400px] lg:h-[460px]">
                                <Image
                                  alt={item.title}
                                  src={item.image}
                                  fill
                                  className="object-contain"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/50" />
                                <div className="absolute top-0 left-0 right-0 p-6 md:p-8">
                                  <div className="space-y-2">
                                    <h3 className="text-lg md:text-2xl font-semibold text-white">
                                      {item.title}
                                    </h3>
                                    <p className="text-xs md:text-sm text-white/90 line-clamp-2 max-w-2xl">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      <button
                        onClick={prevSlide}
                        className="absolute start-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl hover:bg-white dark:hover:bg-slate-800 transition-all hover:scale-110 border border-slate-200/50 dark:border-slate-700/50 z-10"
                        aria-label="Previous feature"
                      >
                        <ChevronLeft className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute end-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl hover:bg-white dark:hover:bg-slate-800 transition-all hover:scale-110 border border-slate-200/50 dark:border-slate-700/50 z-10"
                        aria-label="Next feature"
                      >
                        <ChevronRight className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                      </button>

                      {/* Dots */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                        {showcaseImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`rounded-full transition-all duration-300 ${
                              index === currentSlide
                                ? 'w-8 h-2 bg-white'
                                : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                            }`}
                            aria-label={`Go to feature ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
