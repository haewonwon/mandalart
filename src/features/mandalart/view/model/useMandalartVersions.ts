import { useQuery } from '@tanstack/react-query';
import { fetchMandalartVersions } from '@/shared/api/mandalart';

export const useMandalartVersions = (mandalartId: string | null) => {
  return useQuery({
    queryKey: ['mandalartVersions', mandalartId],
    queryFn: () => fetchMandalartVersions(mandalartId!),
    enabled: !!mandalartId,
  });
};

