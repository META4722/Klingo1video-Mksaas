'use client';

import { Button } from '@/components/ui/button';
import { LocaleLink } from '@/i18n/navigation';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    id: 1,
    badge: 'Seedream 4.5',
    index: '1 / 8',
    title: 'Generate clear, sharp, and legible text',
    description: [
      'Seedream 4.5 renders crisp, readable text for posters, diagrams, product mockups, and more with AI-driven precision.',
      'Describe the typography style you want—bold, elegant, or handwritten—and the model produces sharp, high-quality lettering that elevates your visuals.',
    ],
    image: 'https://assets.seedream45.org/nano2-showcase/text-quality.jpg',
    imageAlt: 'Generate clear, sharp, and legible text',
    reverse: false,
  },
  {
    id: 2,
    badge: 'Seedream 4.5',
    index: '2 / 8',
    title: 'Improved real-world knowledge for precise images',
    description: [
      'Enhanced real-world understanding keeps brand elements, cultural symbols, and details accurate.',
      'The model can also interpret handwriting, annotate images, or convert information into diagrams and infographics for reasoning-driven visual creation.',
    ],
    image: 'https://assets.seedream45.org/nano2-showcase/knowledge.jpg',
    imageAlt: 'Improved real-world knowledge for precise images',
    reverse: true,
  },
  {
    id: 3,
    badge: 'Seedream 4.5',
    index: '3 / 8',
    title: 'Localized, multilingual typography',
    description: [
      'Produce clear typography across English, Chinese, Japanese, Korean, Spanish, Arabic, and more.',
      'Translate and edit text inside images while preserving lighting, spacing, and visual harmony—ideal for global brands.',
    ],
    image: 'https://assets.seedream45.org/nano2-showcase/multilingual.jpg',
    imageAlt: 'Localized, multilingual typography',
    reverse: false,
  },
  {
    id: 4,
    badge: 'Seedream 4.5',
    index: '4 / 8',
    title: 'Turn scribbles and sketches into polished designs',
    description: [
      'Transform rough ideas into clean visuals: convert sketches to detailed objects or shape early drafts into finished concepts.',
      'The model understands structure and intent, standardizing style and refining details from draft to production-ready render.',
    ],
    image: 'https://assets.seedream45.org/nano2-showcase/sketches.jpg',
    imageAlt: 'Turn scribbles and sketches into polished designs',
    reverse: true,
  },
  {
    id: 5,
    badge: 'Seedream 4.5',
    index: '5 / 8',
    title: 'Turn text into 4K images',
    description: [
      'Generate high-resolution, print-ready images from text with sharper details and professional clarity.',
      'Perfect for designers, creators, and illustrators who need top-quality visuals without extra tweaking.',
    ],
    image: 'https://assets.seedream45.org/nano2-showcase/text-to-4k.png',
    imageAlt: 'Turn text into 4K images',
    reverse: false,
  },
  {
    id: 6,
    badge: 'Seedream 4.5',
    index: '6 / 8',
    title: 'Unmatched subject consistency across angles',
    description: [
      'Maintain character resemblance, lighting stability, and scene continuity—supporting multiple characters and objects in one workflow.',
      'Great for virtual IPs, marketing A/B tests, or consistent visual variations.',
    ],
    image: 'https://assets.seedream45.org/nano2-showcase/consistency.jpg',
    imageAlt: 'Unmatched subject consistency across angles',
    reverse: true,
  },
  {
    id: 7,
    badge: 'Seedream 4.5',
    index: '7 / 8',
    title: 'Generate multiple variants with one prompt',
    description: [
      'Explore different creative directions quickly with side-by-side variations from a single prompt.',
      'Review styles and compositions faster, spark inspiration, and pick the best fit without rewriting.',
    ],
    image: 'https://assets.seedream45.org/nano2-showcase/variants.jpg',
    imageAlt: 'Generate multiple variants with one prompt',
    reverse: false,
  },
  {
    id: 8,
    badge: 'Seedream 4.5',
    index: '8 / 8',
    title: 'Upscale images to 1K / 2K / 4K',
    description: [
      'Enhance sharpness and detail without noise or blur, ready for print, presentations, or high-res campaigns.',
      'Even smaller originals become crisp, professional-quality outputs.',
    ],
    image: 'https://assets.seedream45.org/nano2-showcase/upscale.jpg',
    imageAlt: 'Upscale images to 1K / 2K / 4K',
    reverse: true,
  },
];

export default function FeaturesShowcase() {
  return (
    <section className="w-full py-16 sm:py-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wide text-foreground/80">
          <Sparkles className="h-3.5 w-3.5" />
          Seedream 4.5 Highlights
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
          What Seedream 4.5 does best
        </h2>
        <p className="max-w-3xl mx-auto text-muted-foreground">
          A quick tour of the model's strengths—text fidelity, real-world
          knowledge, multilingual layout, and production-ready image quality.
        </p>
      </div>

      {/* Features Grid */}
      <div className="mt-12 space-y-12">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto ${
              feature.reverse ? 'lg:[&>*:first-child]:order-2' : ''
            }`}
          >
            {/* Image */}
            <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-secondary/70 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  alt={feature.imageAlt}
                  src={feature.image}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 640px"
                  loading={feature.id === 1 ? undefined : 'lazy'}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium text-foreground">
                  {feature.badge}
                </span>
                <span className="text-xs text-muted-foreground">
                  {feature.index}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                {feature.description.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  asChild
                  className="rounded-lg shadow-lg shadow-primary/25"
                >
                  <LocaleLink href="/auth/register">
                    Try Seedream 4.5
                  </LocaleLink>
                </Button>
                <Button asChild variant="outline" className="rounded-lg">
                  <LocaleLink href="/ai/image">Explore quality</LocaleLink>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
