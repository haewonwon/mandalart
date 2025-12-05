import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/shared/lib/supabase/client';
import { Mandalart } from '@/entities/mandalart/model/types';

export const useRecentMandalart = () => {
  return useQuery({
    queryKey: ['recentMandalart'],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      // 가장 최근에 업데이트된 만다라트 1개 조회
      const { data, error } = await supabase
        .from('mandalarts')
        .select(
          `
          *,
          current_version:mandalart_versions!fk_current_version(*)
        `
        )
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // 데이터가 없는 경우 (PGRST116) null 반환
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      // 전체 Mandalart 객체 반환 (ID, Version 정보 포함)
      return data as unknown as Mandalart;
    },
  });
};
