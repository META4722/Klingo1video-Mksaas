import { ImagePlayground } from '@/ai/image/components/ImagePlayground';
import { getRandomSuggestions } from '@/ai/image/lib/suggestions';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { WandSparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

/**
 * Creation page - AI Image Generation
 */
export default async function CreationPage() {
  const t = await getTranslations('Dashboard');

  const breadcrumbs = [
    {
      label: t('creation.title'),
      isCurrentPage: true,
    },
  ];

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Header Section */}
            <div className="text-center space-y-6 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <WandSparkles className="size-4" />
                AI Image Creation
              </div>
            </div>

            {/* Image Playground Component */}
            <div className="max-w-6xl mx-auto w-full">
              <ImagePlayground suggestions={getRandomSuggestions(5)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
