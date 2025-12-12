import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase/client';
import { reorderMandalartGrid } from '@/shared/lib/mandalart/reorder';
import { Mandalart, MandalartSubGridKey } from '@/entities/mandalart/model/types';
import { checkBanStatus } from '@/shared/lib/auth/checkBanStatus';

export const useReorderMandalart = (selectedMandalart: Mandalart | null) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (newOrder: (MandalartSubGridKey | 'center')[]) => {
      if (!selectedMandalart?.current_version) {
        throw new Error('데이터가 없습니다.');
      }

      const supabase = createClient();
      const currentData = selectedMandalart.current_version.content;

      // 차단 상태 체크
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('로그인이 필요합니다.');

      const isBanned = await checkBanStatus(supabase, user.id);
      if (isBanned) {
        router.push('/banned');
        throw new Error('차단된 유저는 만다라트를 수정할 수 없습니다.');
      }

      // 1. 위에서 만든 함수로 데이터 재조립
      const reorderedContent = reorderMandalartGrid(currentData, newOrder);

      // 2. RPC 호출 (버전은 DB에서 자동으로 관리)
      const { error } = await supabase.rpc('save_new_version', {
        p_mandalart_id: selectedMandalart.id,
        p_content: reorderedContent, // 재배치된 JSON
        p_version_type: 'REORDER',
        p_note: '만다라트 재배치',
      });

      if (error) throw error;
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

