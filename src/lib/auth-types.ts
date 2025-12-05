import type { auth } from './auth';

// https://www.better-auth.com/docs/concepts/typescript#additional-fields
export type Session = typeof auth.$Infer.Session & {
  user: typeof auth.$Infer.Session.user & {
    customerId?: string | null;
    role?: string | null;
    banned?: boolean | null;
    banReason?: string | null;
    banExpires?: Date | null;
  };
};

export type User = Session['user'];
