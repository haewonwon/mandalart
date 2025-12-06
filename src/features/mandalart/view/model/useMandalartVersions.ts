import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/shared/lib/supabase/client';
import { MandalartVersion } from '@/entities/mandalart/model/types';

export const useMandalartVersions = (mandalartId: string | null) => {
  return useQuery({
    queryKey: ['mandalartVersions', mandalartId],
    queryFn: async () => {
      if (!mandalartId) return [];

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      // 특정 만다라트의 모든 버전 조회
      const { data, error } = await supabase
        .from('mandalart_versions')
        .select('*')
        .eq('mandalart_id', mandalartId)
        .order('version', { ascending: false });

      if (error) {
        console.error('Mandalart Versions Fetch Error:', error);
        return [];
      }

      return (data || []) as MandalartVersion[];
    },
    enabled: !!mandalartId,
  });
};

