import 'server-only';

import { headers } from 'next/headers';
import { cache } from 'react';
import { auth } from './auth';
import type { Session } from './auth-types';

/**
 * Get the current session
 *
 * NOTICE: do not call it from middleware
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
});
