import { useQuery } from '@tanstack/react-query';
import { getMandalartVersions } from '@/shared/api';

export const useMandalartVersions = (mandalartId: string | null) => {
  return useQuery({
    queryKey: ['mandalartVersions', mandalartId],
    queryFn: () => getMandalartVersions(mandalartId!),
    enabled: !!mandalartId,
  });
};

