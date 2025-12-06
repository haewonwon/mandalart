import { createClient } from '@/shared/lib/supabase/client';

export const deleteMandalart = async (id: string) => {
  const supabase = createClient();

  // 헤더만 지우면, 연결된 버전(Cascade)도 다 같이 삭제됨
  const { error } = await supabase
    .from('mandalarts')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
};

