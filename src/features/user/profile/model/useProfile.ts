'use client';

import { createClient } from '@/shared/lib/supabase/client';
import type { Profile } from '@/entities/user/model/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useProfile = () => {
  const queryClient = useQueryClient();
  const supabase = createClient();

  // 1. Fetch Profile (useQuery)
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) return { user: null, profile: null };

      const { data: profileData, error: dbError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (dbError) {
        // Fallback: DB에 없으면 Auth 정보로 임시 구성
        return {
          user,
          profile: {
            id: user.id,
            email: user.email || '',
            nickname: user.user_metadata.full_name || '',
          } as Profile,
        };
      }

      return { user, profile: profileData as Profile };
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });

  // 2. Update Profile (useMutation) - Optimistic Update 적용
  const { mutateAsync: updateProfile, isPending: isSaving } = useMutation({
    mutationFn: async (newNickname: string) => {
      const user = data?.user;
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          nickname: newNickname,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      return newNickname;
    },
    // Optimistic Update: mutation 실행 전에 UI를 먼저 업데이트
    onMutate: async (newNickname: string) => {
      // 진행 중인 쿼리들을 취소하여 낙관적 업데이트를 덮어쓰지 않도록 함
      await queryClient.cancelQueries({ queryKey: ['profile'] });

      // 이전 데이터 백업 (에러 시 롤백용)
      const previousData = queryClient.getQueryData<{ user: any; profile: Profile | null }>(['profile']);

      // 새로운 데이터로 캐시 업데이트 (즉시 UI 반영)
      if (previousData && previousData.profile) {
        queryClient.setQueryData(['profile'], {
          ...previousData,
          profile: {
            ...previousData.profile,
            nickname: newNickname,
            updated_at: new Date().toISOString(),
          },
        });
      }

      // 롤백을 위한 컨텍스트 반환
      return { previousData };
    },
    // 에러 발생 시 이전 데이터로 롤백
    onError: (error, newNickname, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['profile'], context.previousData);
      }
      console.error('Failed to update profile:', error);
      // 에러는 상위 컴포넌트에서 Modal로 처리
    },
    // 성공/실패 관계없이 서버 데이터로 동기화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onSuccess: () => {
      // 성공 메시지는 상위 컴포넌트에서 Modal로 처리
    },
  });

  return {
    user: data?.user ?? null,
    profile: data?.profile ?? null,
    isLoading,
    isSaving,
    updateProfile,
  };
};
