'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/shared/lib/supabase';
import type { User } from '@supabase/supabase-js';

export const useProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;

        if (user) {
          setUser(user);
          setEmail(user.email || '');
          // 메타데이터에 저장된 이름 가져오기 (없으면 이메일 앞부분 사용)
          setNickname(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateProfile = async (newNickname: string) => {
    if (!user) return;
    setIsSaving(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: newNickname },
      });

      if (error) throw error;

      setNickname(newNickname);
      alert('프로필이 수정되었습니다.');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('프로필 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    user,
    email,
    nickname,
    isLoading,
    isSaving,
    updateProfile,
  };
};
