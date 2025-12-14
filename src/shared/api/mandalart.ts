import { createClient } from '@/shared/lib/supabase/client';
import type { Mandalart, MandalartGrid, MandalartVersion, MandalartVersionType } from '@/entities/mandalart/model/types';
import { checkBanStatus } from '@/shared/lib/auth/checkBanStatus';

/**
 * 사용자의 모든 만다라트 조회
 */
export const fetchAllMandalarts = async (): Promise<Mandalart[]> => {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

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
};

/**
 * 가장 최근에 업데이트된 만다라트 1개 조회
 */
export const fetchRecentMandalart = async (): Promise<Mandalart | null> => {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

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

  return data as unknown as Mandalart;
};

/**
 * 특정 만다라트의 모든 버전 조회
 */
export const fetchMandalartVersions = async (mandalartId: string): Promise<MandalartVersion[]> => {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

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
};

/**
 * 특정 만다라트 조회 (ID로)
 */
export const fetchMandalartById = async (mandalartId: string): Promise<Mandalart | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mandalarts')
    .select(
      `
      *,
      current_version:mandalart_versions!fk_current_version(*)
    `
    )
    .eq('id', mandalartId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as unknown as Mandalart;
};

/**
 * 만다라트 생성
 */
export const createMandalart = async (params: {
  title: string;
  year: number;
  initialContent: MandalartGrid;
}): Promise<string> => {
  const supabase = createClient();

  // 로그인 체크
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  // 차단 상태 체크
  const isBanned = await checkBanStatus(supabase, user.id);
  if (isBanned) {
    throw new Error('차단된 유저는 만다라트를 생성할 수 없습니다.');
  }

  const { data, error } = await supabase.rpc('create_mandalart', {
    p_title: params.title,
    p_year: params.year,
    p_initial_content: params.initialContent,
  });

  if (error) throw error;
  return data; // 생성된 ID 반환
};

/**
 * 만다라트 버전 저장 (수정, 재배치 등)
 */
export const saveMandalartVersion = async (params: {
  mandalartId: string;
  content: MandalartGrid;
  versionType: MandalartVersionType;
  note?: string;
}): Promise<void> => {
  const supabase = createClient();

  // 로그인 체크
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  // 차단 상태 체크
  const isBanned = await checkBanStatus(supabase, user.id);
  if (isBanned) {
    throw new Error('차단된 유저는 만다라트를 수정할 수 없습니다.');
  }

  const { error } = await supabase.rpc('save_new_version', {
    p_mandalart_id: params.mandalartId,
    p_content: params.content,
    p_version_type: params.versionType,
    p_note: params.note || '',
  });

  if (error) throw error;
};

/**
 * 만다라트 삭제
 */
export const deleteMandalart = async (mandalartId: string): Promise<void> => {
  const supabase = createClient();

  const { error } = await supabase
    .from('mandalarts')
    .delete()
    .eq('id', mandalartId);

  if (error) throw error;
};

/**
 * 공유용 만다라트 조회 (인증 불필요, 작성자 프로필 포함)
 */
export const fetchMandalartForShare = async (mandalartId: string): Promise<{
  id: string;
  year: number;
  user_id: string;
  current_version: any;
  author: { nickname: string };
} | null> => {
  const supabase = createClient();

  // 만다라트 조회 (maybeSingle 사용하여 결과가 없어도 에러 발생하지 않음)
  const { data: mandalartData, error: mandalartError } = await supabase
    .from('mandalarts')
    .select(
      `
      *,
      current_version:mandalart_versions!fk_current_version(*)
    `
    )
    .eq('id', mandalartId)
    .maybeSingle();

  if (mandalartError) {
    console.error('Mandalart fetch error:', mandalartError);
    throw mandalartError;
  }

  if (!mandalartData) {
    return null;
  }

  // current_version이 없으면 에러
  if (!mandalartData.current_version) {
    throw new Error('만다라트 버전 정보를 찾을 수 없습니다.');
  }

  // 작성자 프로필 정보 조회 (maybeSingle 사용)
  let authorNickname = '익명';
  if (mandalartData?.user_id) {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('id', mandalartData.user_id)
      .maybeSingle();

    // 프로필이 없어도 에러가 아니므로 계속 진행
    if (!profileError && profileData) {
      authorNickname = profileData.nickname || '익명';
    }
  }

  return {
    ...mandalartData,
    author: { nickname: authorNickname },
  } as any;
};

