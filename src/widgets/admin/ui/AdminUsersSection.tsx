'use client';

import { useEffect, useState } from 'react';
import { Loader2, Mail, Ban, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/shared/lib';

interface User {
  id: string;
  nickname: string | null;
  email: string | null;
  created_at: string;
  last_mandalart_created_at: string | null;
  is_banned: boolean | null;
}

export const AdminUsersSection = () => {
  const supabase = createClient();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // 1. 유저 리스트 가져오기
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, nickname, email, created_at, is_banned')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error(profilesError);
      alert('유저 목록을 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
      return;
    }

    // 2. 해당 유저들의 최근 만다라트 생성일을 한 번에 조회 (N+1 쿼리 방지)
    const profileIds = (profilesData || []).map((profile) => profile.id);
    let lastCreatedMap = new Map<string, string | null>();

    if (profileIds.length > 0) {
      const { data: mandalartRows, error: mandalartError } = await supabase
        .from('mandalarts')
        .select('user_id, created_at')
        .in('user_id', profileIds)
        .order('created_at', { ascending: false });

      if (mandalartError) {
        console.error(mandalartError);
      } else {
        lastCreatedMap = new Map<string, string | null>();
        (mandalartRows || []).forEach((row) => {
          const userId = (row as any).user_id as string;
          const createdAt = (row as any).created_at as string;
          // 정렬이 최신순이므로 처음 등장하는 값이 가장 최근
          if (!lastCreatedMap.has(userId)) {
            lastCreatedMap.set(userId, createdAt);
          }
        });
      }
    }

    const usersWithMandalart: User[] = (profilesData || []).map((profile) => ({
      ...profile,
      last_mandalart_created_at: lastCreatedMap.get(profile.id) || null,
    }));

    setUsers(usersWithMandalart);
    setLoading(false);
  };

  const toggleBan = async (userId: string, currentBanStatus: boolean, nickname: string | null) => {
    const action = currentBanStatus ? '해제' : '차단';
    if (!confirm(`'${nickname || '유저'}'님을 정말 ${action}하시겠습니까?`)) return;

    try {
      // profiles 테이블의 is_banned 컬럼을 수정
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: !currentBanStatus }) // true <-> false 토글
        .eq('id', userId);

      if (error) throw error;

      alert(`${action} 처리되었습니다.`);
      fetchUsers(); // 목록 새로고침 (UI 갱신)
    } catch (e) {
      console.error(e);
      alert('오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {users.length === 0 ? (
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 px-6 py-12 text-center">
            <p className="text-slate-400">유저가 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800/30">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-800/50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                    닉네임
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                    이메일
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">상태</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                    가입일
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                    최근 만다라트 생성일
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const signupDate = new Date(user.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });
                  const lastMandalartDate = user.last_mandalart_created_at
                    ? new Date(user.last_mandalart_created_at).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : '-';

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-slate-700/30 hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-slate-200 font-medium">
                        {user.nickname || '익명'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">
                        {user.email ? (
                          <a
                            href={`mailto:${user.email}`}
                            className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 transition-colors"
                          >
                            <Mail size={14} />
                            {user.email}
                          </a>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {user.is_banned ? (
                          <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400 border border-red-500/20">
                            차단됨
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                            정상
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">{signupDate}</td>
                      <td className="px-4 py-3 text-sm text-slate-400">{lastMandalartDate}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              toggleBan(user.id, user.is_banned === true, user.nickname)
                            }
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-white rounded-lg text-sm transition-all border ${
                              user.is_banned
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/20'
                                : 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 hover:shadow-lg hover:shadow-red-500/20'
                            }`}
                          >
                            {user.is_banned ? (
                              <>
                                <CheckCircle2 size={14} />
                                차단 해제
                              </>
                            ) : (
                              <>
                                <Ban size={14} />
                                차단하기
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};
