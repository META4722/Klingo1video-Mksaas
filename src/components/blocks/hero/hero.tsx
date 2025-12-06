import { AnimatedGroup } from '@/components/tailark/motion/animated-group';
import { TextEffect } from '@/components/tailark/motion/text-effect';
import { Button } from '@/components/ui/button';
import { LocaleLink } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      y: 12,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  const t = useTranslations('HomePage.hero');
  const linkIntroduction = '/about';
  const linkPrimary = '#generation';
  const linkSecondary = '/ai/image';

  return (
    <>
      <main id="hero" className="overflow-hidden relative min-h-[85vh] md:min-h-[90vh]">
        {/* Video Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src="/videos/Marco_-_Kling_O1_is_so_dope_I_added_a_reference_subject_and_a_reference_en..._0r7xol.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* background, light shadows on top of the hero section */}
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-30 contain-strict lg:block pointer-events-none"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>

        <section className="flex items-center min-h-[85vh] md:min-h-[90vh]">
          <div className="relative pt-12 pb-16 w-full">
            <div className="mx-auto max-w-7xl px-6">

              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                {/* title */}
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mt-8 text-balance text-6xl font-black font-bricolage-grotesque lg:mt-16 xl:text-[7rem] text-white"
                >
                  {t('title')}
                </TextEffect>

                {/* description */}
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mx-auto mt-8 max-w-4xl text-balance text-lg text-white/90"
                >
                  {t('description')}
                </TextEffect>

                {/* action buttons */}
                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-row items-center justify-center gap-4"
                >
                  <div
                    key={1}
                    className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl px-5 text-base"
                    >
                      <LocaleLink href={linkPrimary}>
                        <span className="text-nowrap">{t('primary')}</span>
                      </LocaleLink>
                    </Button>
                  </div>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-10.5 rounded-xl px-5"
                  >
                    <LocaleLink href={linkSecondary}>
                      <span className="text-nowrap">{t('secondary')}</span>
                    </LocaleLink>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
