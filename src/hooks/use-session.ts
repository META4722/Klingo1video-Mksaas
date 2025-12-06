import { authClient } from '@/lib/auth-client';

export const useSession = () => {
  const { data: session, error, isPending } = authClient.useSession();

  // Only log errors that are not related to "no session" scenarios
  if (error && !isPending) {
    // Silently handle expected errors (no session, not logged in, etc.)
    // These are normal states, not actual errors
    const errorMessage = error?.message || String(error);
    if (!errorMessage.includes('session') && !errorMessage.includes('unauthorized')) {
      console.error('useSession, error:', error);
    }
  }

  return session;
};
