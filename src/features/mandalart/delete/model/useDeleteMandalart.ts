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
      alert(error.message || '삭제 중 오류가 발생했습니다.');
    },
  });
};

