'use server';

import {
  consumeCredits as consumeCreditsDb,
  getUserCredits as getUserCreditsDb,
  hasEnoughCredits as hasEnoughCreditsDb,
} from '@/credits/credits';

/**
 * Get user's current credit balance
 */
export async function getUserCreditsAction(userId: string) {
  try {
    const credits = await getUserCreditsDb(userId);
    return { success: true, credits };
  } catch (error) {
    console.error('getUserCreditsAction error:', error);
    return { success: false, credits: 0 };
  }
}

/**
 * Check if user has enough credits
 */
export async function hasEnoughCreditsAction(params: {
  userId: string;
  requiredCredits: number;
}) {
  try {
    const hasCredits = await hasEnoughCreditsDb(params);
    return { success: true, hasCredits };
  } catch (error) {
    console.error('hasEnoughCreditsAction error:', error);
    return { success: false, hasCredits: false };
  }
}

/**
 * Consume credits for a transaction
 */
export async function consumeCreditsAction(params: {
  userId: string;
  amount: number;
  description: string;
}) {
  try {
    await consumeCreditsDb(params);
    return { success: true };
  } catch (error) {
    console.error('consumeCreditsAction error:', error);
    return { success: false, error: 'Failed to consume credits' };
  }
}
