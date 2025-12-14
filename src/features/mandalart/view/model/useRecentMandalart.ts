import { useQuery } from '@tanstack/react-query';
import { fetchRecentMandalart } from '@/shared/api/mandalart';

export const useRecentMandalart = () => {
  return useQuery({
    queryKey: ['recentMandalart'],
    queryFn: fetchRecentMandalart,
  });
};
