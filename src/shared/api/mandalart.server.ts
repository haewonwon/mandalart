import { createClient } from '@/shared/lib/supabase/server';
import type { Mandalart } from '@/entities/mandalart/model/types';

/**
 * 서버 사이드: 사용자의 모든 만다라트 조회
 */
export const fetchAllMandalartsServer = async (userId: string): Promise<Mandalart[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('mandalarts')
    .select(
      `
      *,
      current_version:mandalart_versions!fk_current_version(*)
    `
    )
    .eq('user_id', userId)
    .order('year', { ascending: false });

  if (error) {
    console.error('Mandalart Fetch Error:', error);
    return [];
  }

  return (data || []) as unknown as Mandalart[];
};

/**
 * 서버 사이드: 프로필 닉네임 조회
 */
export const fetchProfileNicknameServer = async (userId: string): Promise<string | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('nickname')
    .eq('id', userId)
    .single();

  if (error) {
    return null;
  }

  return data?.nickname || null;
};

