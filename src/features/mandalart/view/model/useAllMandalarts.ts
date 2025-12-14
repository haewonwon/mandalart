import { useQuery } from '@tanstack/react-query';
import { fetchAllMandalarts } from '@/shared/api/mandalart';

export const useAllMandalarts = () => {
  return useQuery({
    queryKey: ['allMandalarts'],
    queryFn: fetchAllMandalarts,
  });
};

