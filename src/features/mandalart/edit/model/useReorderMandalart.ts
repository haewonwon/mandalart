import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { reorderMandalartGrid } from '@/shared/lib/mandalart/reorder';
import { Mandalart, MandalartSubGridKey } from '@/entities/mandalart/model/types';
import { updateMandalart } from '@/shared/api';

export const useReorderMandalart = (selectedMandalart: Mandalart | null) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (newOrder: (MandalartSubGridKey | 'center')[]) => {
      if (!selectedMandalart?.current_version) {
        throw new Error('데이터가 없습니다.');
      }

      const currentData = selectedMandalart.current_version.content;

      // 1. 위에서 만든 함수로 데이터 재조립
      const reorderedContent = reorderMandalartGrid(currentData, newOrder);

      // 2. API 호출 (차단 체크는 API 내부에서 처리)
      await updateMandalart({
        mandalartId: selectedMandalart.id,
        content: reorderedContent,
        versionType: 'REORDER',
        note: '만다라트 재배치',
      });
    },
    onSuccess: () => {
      // 쿼리 무효화로 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ['allMandalarts'] });
      queryClient.invalidateQueries({ queryKey: ['recentMandalart'] });
      queryClient.invalidateQueries({ queryKey: ['mandalartVersions'] });
      // alert('저장되었습니다.'); // UX상 드래그앤드롭은 조용히 저장되는 게 좋을 수도 있음
    },
    onError: (err) => {
      console.error(err);
      // 에러는 상위 컴포넌트에서 Modal로 처리
    },
  });
};

