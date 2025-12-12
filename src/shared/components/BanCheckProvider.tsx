'use client';

import { useBanCheck } from '@/features/auth/model/useBanCheck';

export const BanCheckProvider = ({ children }: { children: React.ReactNode }) => {
  useBanCheck();
  return <>{children}</>;
};
