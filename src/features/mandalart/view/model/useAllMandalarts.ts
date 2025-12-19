import { useQuery } from '@tanstack/react-query';
import { getAllMandalarts } from '@/shared/api';

export const useAllMandalarts = () => {
  return useQuery({
    queryKey: ['allMandalarts'],
    queryFn: getAllMandalarts,
  });
};

