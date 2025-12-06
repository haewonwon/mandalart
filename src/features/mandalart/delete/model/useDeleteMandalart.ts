'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMandalart } from './deleteMandalart';

export const useDeleteMandalart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteMandalart(id);
      return id;
    },
    onSuccess: () => {
      // 모든 만다라트 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['allMandalarts'] });
      queryClient.invalidateQueries({ queryKey: ['recentMandalart'] });
      queryClient.invalidateQueries({ queryKey: ['mandalartVersions'] });
    },
    onError: (error: any) => {
      console.error('Delete Error:', error);
      // 에러는 상위 컴포넌트에서 Modal로 처리
    },
  });
};

