import { getDashboardDataAction } from '@/actions/get-dashboard-data';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { SectionCards } from '@/components/dashboard/section-cards';
import { getTranslations } from 'next-intl/server';

/**
 * Dashboard page
 */
export default async function DashboardPage() {
  const t = await getTranslations();

  const breadcrumbs = [
    {
      label: t('Dashboard.dashboard.title'),
      isCurrentPage: true,
    },
  ];

  // Fetch dashboard data
  const result = await getDashboardDataAction();

  // Extract data or use default values
  const defaultData = {
    currentCredits: 0,
    expiringCredits: 0,
    monthlyUsage: 0,
    subscriptionStatus: 'unsubscribed' as const,
    planName: null,
  };

  type DashboardData = typeof defaultData;

  const dashboardData: DashboardData =
    (result?.data as unknown as DashboardData) || defaultData;

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards
              currentCredits={dashboardData.currentCredits}
              expiringCredits={dashboardData.expiringCredits}
              monthlyUsage={dashboardData.monthlyUsage}
              subscriptionStatus={dashboardData.subscriptionStatus}
              planName={dashboardData.planName}
            />
          </div>
        </div>
      </div>
    </>
  );
}
