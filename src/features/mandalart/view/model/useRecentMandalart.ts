import { useQuery } from '@tanstack/react-query';
import { getRecentMandalart } from '@/shared/api';

export const useRecentMandalart = () => {
  return useQuery({
    queryKey: ['recentMandalart'],
    queryFn: getRecentMandalart,
  });
};
