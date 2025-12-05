import { CheckCircle, CircleX, TrendingUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslations } from 'next-intl';

interface SectionCardsProps {
  currentCredits: number;
  expiringCredits: number;
  monthlyUsage: number;
  subscriptionStatus: 'lifetime' | 'subscribed' | 'unsubscribed';
  planName?: string | null;
}

export function SectionCards({
  currentCredits,
  expiringCredits,
  monthlyUsage,
  subscriptionStatus,
  planName,
}: SectionCardsProps) {
  const t = useTranslations('Dashboard.cards');

  const getSubscriptionStatusText = () => {
    if (subscriptionStatus === 'lifetime') {
      return planName || t('subscriptionStatus.lifetime');
    }
    if (subscriptionStatus === 'subscribed') {
      return planName || t('subscriptionStatus.subscribed');
    }
    return t('subscriptionStatus.unsubscribed');
  };

  const getSubscriptionIcon = () => {
    if (
      subscriptionStatus === 'lifetime' ||
      subscriptionStatus === 'subscribed'
    ) {
      return <CheckCircle className="size-4 text-green-500" />;
    }
    return <CircleX className="size-4 text-gray-400" />;
  };

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t('currentCredits.title')}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {currentCredits}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp className="size-4" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {t('currentCredits.description')}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t('expiringSoon.title')}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {expiringCredits}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-orange-500">
              <TrendingUp className="size-4" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {t('expiringSoon.description')}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t('monthlyUsage.title')}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {monthlyUsage}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp className="size-4" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {t('monthlyUsage.description')}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t('subscriptionStatus.title')}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {getSubscriptionStatusText()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">{getSubscriptionIcon()}</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {t('subscriptionStatus.description')}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
