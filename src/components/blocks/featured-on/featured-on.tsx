import Container from '@/components/layout/container';

export default function FeaturedOn() {
  return (
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
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=light"
                width={120}
                height={30}
                alt="Fazier badge"
                className="h-6 w-auto dark:brightness-90"
              />
            </a>

            {/* Super Launch */}
            <a
              href="https://www.superlaun.ch/products/1170"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src="https://www.superlaun.ch/badge.png"
                alt="Featured on Super Launch"
                width={60}
                height={60}
                className="h-6 w-auto"
              />
            </a>

            {/* Turbo0 */}
            <a
              href="https://turbo0.com/item/seedream-4-5"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src="https://img.turbo0.com/badge-listed-light.svg"
                alt="Listed on Turbo0"
                className="h-6 w-auto"
              />
            </a>

            {/* ShowMeBestAI */}
            <a
              href="https://www.showmebest.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src="https://www.showmebest.ai/badge/feature-badge-white.webp"
                alt="Featured on ShowMeBestAI"
                width={100}
                height={27}
                className="h-6 w-auto"
              />
            </a>

            {/* Twelve Tools */}
            <a
              href="https://twelve.tools"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src="https://twelve.tools/badge0-light.svg"
                alt="Featured on Twelve Tools"
                width={90}
                height={24}
                className="h-6 w-auto"
              />
            </a>

            {/* Dang.ai */}
            <a
              href="https://dang.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src="https://cdn.prod.website-files.com/63d8afd87da01fb58ea3fbcb/6487e2868c6c8f93b4828827_dang-badge.png"
                alt="Dang.ai"
                width={70}
                height={24}
                className="h-6 w-auto"
              />
            </a>

            {/* AIStage */}
            <a
              href="https://aistage.net"
              target="_blank"
              rel="noopener noreferrer"
              title="AIStage"
              className="text-xs font-medium hover:text-primary transition-colors px-3 py-1 border border-border rounded-md hover:border-primary"
            >
              AIStage
            </a>

            {/* Startup Fame */}
            <a
              href="https://startupfa.me/s/seedream-45-2?utm_source=seedream4-5.io"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src="https://startupfa.me/badges/featured/default.webp"
                alt="Kling O1 - Featured on Startup Fame"
                width={80}
                height={25}
                className="h-6 w-auto"
              />
            </a>

            {/* AI Agents Directory */}
            <a
              href="https://aiagentsdirectory.com/agent/seedream-45?utm_source=badge&utm_medium=referral&utm_campaign=free_listing&utm_content=seedream-45"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src="https://aiagentsdirectory.com/featured-badge.svg?v=2024"
                alt="Kling O1 - Featured AI Agent on AI Agents Directory"
                width={90}
                height={22}
                className="h-6 w-auto"
              />
            </a>

            {/* Aura++ */}
            <a
              href="https://auraplusplus.com/projects/kling-o1"
              target="_blank"
              rel="noopener"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src="https://auraplusplus.com/images/badges/featured-on-light.svg"
                alt="Featured on Aura++"
                className="h-6 w-auto"
              />
            </a>

            {/* All Your Tech */}
            <a
              href="https://allyourtech.ai"
              target="_blank"
              rel="noopener noreferrer"
              title="AI Tools Directory"
              className="text-xs font-medium hover:text-primary transition-colors px-3 py-1 border border-border rounded-md hover:border-primary"
            >
              AI Tools Directory
            </a>

            {/* AI Toolz Dir */}
            <a
              href="https://www.aitoolzdir.com"
              target="_blank"
              rel="noopener noreferrer"
              title="AI Toolz Dir"
              className="text-xs font-medium hover:text-primary transition-colors px-3 py-1 border border-border rounded-md hover:border-primary"
            >
              AI Toolz Dir
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
