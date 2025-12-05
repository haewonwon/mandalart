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

  // 2. Update Profile (useMutation)
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
    onSuccess: () => {
      // 캐시 무효화하여 데이터를 다시 가져오게 함 (WelcomeSection 등 자동 갱신)
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      alert('프로필이 수정되었습니다.');
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
      alert('프로필 수정 중 오류가 발생했습니다.');
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
