'use server';

import { getUserCredits } from '@/credits/credits';
import { CREDIT_TRANSACTION_TYPE } from '@/credits/types';
import { getDb } from '@/db';
import { creditTransaction, payment } from '@/db/schema';
import type { User } from '@/lib/auth-types';
import { CREDITS_EXPIRATION_DAYS } from '@/lib/constants';
import { findPlanByPriceId, getAllPricePlans } from '@/lib/price-plan';
import { userActionClient } from '@/lib/safe-action';
import {
  PaymentScenes,
  type PaymentStatus,
  PaymentTypes,
  type PlanInterval,
  type Subscription,
} from '@/payment/types';
import { addDays } from 'date-fns';
import {
  and,
  desc,
  eq,
  gt,
  gte,
  isNotNull,
  lte,
  or,
  sql,
  sum,
} from 'drizzle-orm';

/**
 * Get all dashboard data for the current user
 * Includes: current credits, expiring credits, monthly usage, and subscription status
 */
export const getDashboardDataAction = userActionClient.action(
  async ({ ctx }) => {
    try {
      const currentUser = (ctx as { user: User }).user;
      const userId = currentUser.id;

      const db = await getDb();
      const now = new Date();

      // 1. Get current credits
      const currentCredits = await getUserCredits(userId);

      // 2. Get credits expiring in the next 30 days
      const expirationDaysFromNow = addDays(now, CREDITS_EXPIRATION_DAYS);
      const expiringCreditsResult = await db
        .select({
          totalAmount: sum(creditTransaction.remainingAmount),
        })
        .from(creditTransaction)
        .where(
          and(
            eq(creditTransaction.userId, userId),
            isNotNull(creditTransaction.expirationDate),
            isNotNull(creditTransaction.remainingAmount),
            gt(creditTransaction.remainingAmount, 0),
            lte(creditTransaction.expirationDate, expirationDaysFromNow),
            gte(creditTransaction.expirationDate, now)
          )
        );

      const expiringCredits =
        Number(expiringCreditsResult[0]?.totalAmount) || 0;

      // 3. Get monthly usage (credits spent this month)
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const monthlyUsageResult = await db
        .select({
          totalUsed: sum(creditTransaction.amount),
        })
        .from(creditTransaction)
        .where(
          and(
            eq(creditTransaction.userId, userId),
            eq(creditTransaction.type, CREDIT_TRANSACTION_TYPE.USAGE),
            sql`EXTRACT(MONTH FROM ${creditTransaction.createdAt}) = ${currentMonth + 1}`,
            sql`EXTRACT(YEAR FROM ${creditTransaction.createdAt}) = ${currentYear}`
          )
        );

      // Usage records have negative amounts, so we negate to get positive count
      const monthlyUsage = Math.abs(
        Number(monthlyUsageResult[0]?.totalUsed) || 0
      );

      // 4. Get subscription status
      const plans = getAllPricePlans();
      const lifetimePlanIds = plans
        .filter((plan) => plan.isLifetime)
        .map((plan) => plan.id);

      const payments = await db
        .select({
          id: payment.id,
          priceId: payment.priceId,
          customerId: payment.customerId,
          type: payment.type,
          status: payment.status,
          scene: payment.scene,
          interval: payment.interval,
          periodStart: payment.periodStart,
          periodEnd: payment.periodEnd,
          cancelAtPeriodEnd: payment.cancelAtPeriodEnd,
          trialStart: payment.trialStart,
          trialEnd: payment.trialEnd,
          createdAt: payment.createdAt,
        })
        .from(payment)
        .where(
          and(
            eq(payment.paid, true),
            eq(payment.userId, userId),
            or(
              // Check for completed lifetime payments
              and(
                eq(payment.type, PaymentTypes.ONE_TIME),
                eq(payment.scene, PaymentScenes.LIFETIME),
                eq(payment.status, 'completed')
              ),
              // Check for active or trialing subscriptions
              and(
                eq(payment.type, PaymentTypes.SUBSCRIPTION),
                or(eq(payment.status, 'active'), eq(payment.status, 'trialing'))
              )
            )
          )
        )
        .orderBy(desc(payment.createdAt));

      // Determine subscription status
      let subscriptionStatus: 'lifetime' | 'subscribed' | 'unsubscribed' =
        'unsubscribed';
      let activeSubscription: Subscription | null = null;
      let planName: string | null = null;

      for (const paymentRecord of payments) {
        // Check for lifetime plan first (higher priority)
        if (
          paymentRecord.type === PaymentTypes.ONE_TIME &&
          paymentRecord.scene === PaymentScenes.LIFETIME &&
          paymentRecord.status === 'completed'
        ) {
          const pricePlan = findPlanByPriceId(paymentRecord.priceId);
          if (pricePlan && lifetimePlanIds.includes(pricePlan.id)) {
            subscriptionStatus = 'lifetime';
            planName = pricePlan.name || null;
            break;
          }
        }

        // Check for active subscription
        if (
          subscriptionStatus === 'unsubscribed' &&
          paymentRecord.type === PaymentTypes.SUBSCRIPTION &&
          (paymentRecord.status === 'active' ||
            paymentRecord.status === 'trialing')
        ) {
          activeSubscription = {
            id: paymentRecord.id!,
            priceId: paymentRecord.priceId,
            customerId: paymentRecord.customerId,
            status: paymentRecord.status as PaymentStatus,
            type: paymentRecord.type as PaymentTypes,
            interval: paymentRecord.interval as PlanInterval,
            currentPeriodStart: paymentRecord.periodStart || undefined,
            currentPeriodEnd: paymentRecord.periodEnd || undefined,
            cancelAtPeriodEnd: paymentRecord.cancelAtPeriodEnd || false,
            trialStartDate: paymentRecord.trialStart || undefined,
            trialEndDate: paymentRecord.trialEnd || undefined,
            createdAt: paymentRecord.createdAt,
          };
          subscriptionStatus = 'subscribed';

          const pricePlan = plans.find((p) =>
            p.prices.find(
              (price) => price.priceId === activeSubscription!.priceId
            )
          );
          planName = pricePlan?.name || null;
          break;
        }
      }

      return {
        success: true,
        data: {
          currentCredits,
          expiringCredits,
          monthlyUsage,
          subscriptionStatus,
          planName,
          subscription: activeSubscription,
        },
      };
    } catch (error) {
      console.error('get dashboard data error:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch dashboard data',
      };
    }
  }
);
