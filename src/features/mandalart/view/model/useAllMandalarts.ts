import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/shared/lib/supabase/client';
import { Mandalart } from '@/entities/mandalart/model/types';

export const useAllMandalarts = () => {
  return useQuery({
    queryKey: ['allMandalarts'],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      // 사용자의 모든 만다라트 조회
      const { data, error } = await supabase
        .from('mandalarts')
        .select(
          `
          *,
          current_version:mandalart_versions!fk_current_version(*)
        `
        )
        .eq('user_id', user.id)
        .order('year', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Mandalart Fetch Error:', error);
        return [];
      }

      return (data || []) as unknown as Mandalart[];
    },
  });
};

