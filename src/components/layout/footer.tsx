'use client';

import Container from '@/components/layout/container';
import { Logo } from '@/components/layout/logo';
import { ModeSwitcherHorizontal } from '@/components/layout/mode-switcher-horizontal';
import BuiltWithButton from '@/components/shared/built-with-button';
import { useFooterLinks } from '@/config/footer-config';
import { useSocialLinks } from '@/config/social-config';
import { LocaleLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import type React from 'react';

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  const t = useTranslations();
  const footerLinks = useFooterLinks();
  const socialLinks = useSocialLinks();

  return (
    <footer className={cn('border-t', className)}>
      <Container className="px-4">
        <div className="grid grid-cols-2 gap-8 py-16 md:grid-cols-6">
          <div className="flex flex-col items-start col-span-full md:col-span-2">
            <div className="space-y-4">
              {/* logo and name */}
              <div className="items-center space-x-2 flex">
                <Logo />
                <span className="text-xl font-semibold">
                  {t('Metadata.name')}
                </span>
              </div>

              {/* tagline */}
              <p className="text-muted-foreground text-base py-2 md:pr-12">
                {t('Marketing.footer.tagline')}
              </p>

              {/* social links - Hidden for Kling O1 */}
              {/* <div className="flex items-center gap-4 py-2">
                <div className="flex items-center gap-2">
                  {socialLinks?.map((link) => (
                    <a
                      key={link.title}
                      href={link.href || '#'}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.title}
                      className="border border-border inline-flex h-8 w-8 items-center
                          justify-center rounded-full hover:bg-accent hover:text-accent-foreground"
                    >
                      <span className="sr-only">{link.title}</span>
                      {link.icon ? link.icon : null}
                    </a>
                  ))}
                </div>
              </div> */}

              {/* built with button - Hidden for Kling O1 */}
              {/* <BuiltWithButton /> */}
            </div>
          </div>

          {/* footer links */}
          {footerLinks?.map((section) => (
            <div
              key={section.title}
              className="col-span-1 md:col-span-1 items-start"
            >
              <span className="text-sm font-semibold uppercase">
                {section.title}
              </span>
              <ul className="mt-4 list-inside space-y-3">
                {section.items?.map(
                  (item) =>
                    item.href && (
                      <li key={item.title}>
                        <LocaleLink
                          href={item.href || '#'}
                          target={item.external ? '_blank' : undefined}
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          {item.title}
                        </LocaleLink>
                      </li>
                    )
                )}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      {/* As Featured On Section */}
      <div className="border-t bg-muted/20 py-6">
        <Container className="px-4">
          <div className="flex flex-col items-center gap-4">
            {/* Title */}
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              As Featured On
            </h3>

            {/* Badges Grid */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {/* Fazier */}
              <a
                href="https://fazier.com/launches/seedream4-5.io"
                target="_blank"
                rel="noopener"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=light"
                  width={120}
                  height={30}
                  alt="Fazier badge"
                  className="h-6 w-auto dark:brightness-90"
                  unoptimized
                />
              </a>

              {/* Super Launch */}
              <a
                href="https://www.superlaun.ch/products/1170"
                target="_blank"
                rel="noopener"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src="https://www.superlaun.ch/badge.png"
                  alt="Featured on Super Launch"
                  width={60}
                  height={60}
                  className="h-6 w-auto"
                  unoptimized
                />
              </a>

              {/* Turbo0 */}
              <a
                href="https://turbo0.com/item/seedream-4-5"
                target="_blank"
                rel="noopener"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src="https://img.turbo0.com/badge-listed-light.svg"
                  alt="Listed on Turbo0"
                  width={120}
                  height={30}
                  className="h-6 w-auto"
                  unoptimized
                />
              </a>

              {/* ShowMeBestAI */}
              <a
                href="https://www.showmebest.ai"
                target="_blank"
                rel="noopener"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src="https://www.showmebest.ai/badge/feature-badge-white.webp"
                  alt="Featured on ShowMeBestAI"
                  width={100}
                  height={27}
                  className="h-6 w-auto"
                  unoptimized
                />
              </a>

              {/* Twelve Tools */}
              <a
                href="https://twelve.tools"
                target="_blank"
                rel="noopener"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src="https://twelve.tools/badge0-light.svg"
                  alt="Featured on Twelve Tools"
                  width={90}
                  height={24}
                  className="h-6 w-auto"
                  unoptimized
                />
              </a>

              {/* Dang.ai */}
              <a
                href="https://dang.ai/"
                target="_blank"
                rel="noopener"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src="https://cdn.prod.website-files.com/63d8afd87da01fb58ea3fbcb/6487e2868c6c8f93b4828827_dang-badge.png"
                  alt="Dang.ai"
                  width={70}
                  height={24}
                  className="h-6 w-auto"
                  unoptimized
                />
              </a>

              {/* AIStage */}
              <a
                href="https://aistage.net"
                target="_blank"
                rel="noopener"
                title="AIStage"
                className="text-xs font-medium hover:text-primary transition-colors px-3 py-1 border border-border rounded-md hover:border-primary"
              >
                AIStage
              </a>

              {/* Startup Fame */}
              <a
                href="https://startupfa.me/s/seedream-45-2?utm_source=seedream4-5.io"
                target="_blank"
                rel="noopener"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src="https://startupfa.me/badges/featured/default.webp"
                  alt="Kling O1 - Featured on Startup Fame"
                  width={80}
                  height={25}
                  className="h-6 w-auto"
                  unoptimized
                />
              </a>

              {/* AI Agents Directory */}
              <a
                href="https://aiagentsdirectory.com/agent/seedream-45?utm_source=badge&utm_medium=referral&utm_campaign=free_listing&utm_content=seedream-45"
                target="_blank"
                rel="noopener"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src="https://aiagentsdirectory.com/featured-badge.svg?v=2024"
                  alt="Kling O1 - Featured AI Agent on AI Agents Directory"
                  width={90}
                  height={22}
                  className="h-6 w-auto"
                  unoptimized
                />
              </a>

              {/* Aura++ */}
              <a
                href="https://auraplusplus.com/projects/kling-o1"
                target="_blank"
                rel="noopener"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src="https://auraplusplus.com/images/badges/featured-on-light.svg"
                  alt="Featured on Aura++"
                  width={100}
                  height={30}
                  className="h-6 w-auto"
                  unoptimized
                />
              </a>

              {/* All Your Tech */}
              <a
                href="https://allyourtech.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium hover:text-primary transition-colors px-3 py-1 border border-border rounded-md hover:border-primary"
              >
                AI Tools Directory
              </a>

              {/* AI Toolz Dir */}
              <a
                href="https://www.aitoolzdir.com"
                target="_blank"
                rel="noopener"
                className="text-xs font-medium hover:text-primary transition-colors px-3 py-1 border border-border rounded-md hover:border-primary"
              >
                AI Toolz Dir
              </a>
            </div>
          </div>
        </Container>
      </div>

      <div className="border-t py-8">
        <Container className="px-4 flex items-center justify-between gap-x-4">
          <span className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} {t('Metadata.name')} All Rights
            Reserved.
          </span>

          {/* Mode switcher - Hidden for Kling O1 */}
          {/* <div className="flex items-center gap-x-4">
            <ModeSwitcherHorizontal />
          </div> */}
        </Container>
      </div>
    </footer>
  );
}
