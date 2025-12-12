'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Shield, BarChart3, MessageSquare, Users } from 'lucide-react';
import { createClient } from '@/shared/lib/supabase/client';
import { useModal } from '@/shared/hooks/useModal';
import { AlertModal } from '@/shared/ui/AlertModal';
import { AdminDashboardSection } from '@/widgets/admin/ui/AdminDashboardSection';
import { AdminFeedbackSection } from '@/widgets/admin/ui/AdminFeedbackSection';
import { AdminUsersSection } from '@/widgets/admin/ui/AdminUsersSection';

type Tab = 'dashboard' | 'feedback' | 'users';

export const AdminPage = () => {
  const supabase = createClient();
  const router = useRouter();
  const modal = useModal();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push('/');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('관리자 권한 확인 실패:', profileError);
        modal.alert.show({
          type: 'error',
          message: '관리자 권한을 확인할 수 없습니다.',
        });
        setTimeout(() => {
          router.push('/');
        }, 1500);
        return;
      }

      if (!profile || profile.is_admin !== true) {
        modal.alert.show({
          type: 'error',
          message: '관리자만 접근 가능합니다.',
        });
        setTimeout(() => {
          router.push('/');
        }, 1500);
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error('관리자 권한 확인 중 오류:', error);
      modal.alert.show({
        type: 'error',
        message: '관리자 권한을 확인하는 중 오류가 발생했습니다.',
      });
      setTimeout(() => {
        router.push('/');
      }, 1500);
    }
  };

  if (loading) {
    return (
      <main className="flex flex-col flex-1 bg-slate-900 min-h-screen">
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
      </main>
    );
  }

  const tabs = [
    { id: 'dashboard' as Tab, label: '대시보드', icon: BarChart3 },
    { id: 'feedback' as Tab, label: '티켓 관리', icon: MessageSquare },
    { id: 'users' as Tab, label: '유저 관리', icon: Users },
  ];

  return (
    <main className="flex flex-col flex-1 bg-slate-900 min-h-screen">
      {/* Custom Header */}
      <header className="sticky top-0 z-10 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 sm:px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full text-slate-300 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-blue-400" />
            <h1 className="font-semibold text-slate-100 text-lg">관리자 페이지</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-8 sm:px-8">
        <section className="w-full max-w-6xl space-y-6">
          <header className="mb-6 space-y-2 text-center sm:text-left">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">ADMIN</p>
            <h2 className="text-3xl font-semibold text-slate-100 sm:text-4xl">관리자 대시보드</h2>
            <p className="text-base text-slate-400">서비스 현황을 확인하고 관리하세요.</p>
          </header>

          {/* 탭 네비게이션 */}
          <div className="flex gap-2 border-b border-slate-700/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-slate-100'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 탭 컨텐츠 */}
          <div className="mt-6">
            {activeTab === 'dashboard' && <AdminDashboardSection />}
            {activeTab === 'feedback' && <AdminFeedbackSection />}
            {activeTab === 'users' && <AdminUsersSection />}
          </div>
        </section>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={modal.alert.isOpen}
        onClose={modal.alert.hide}
        message={modal.alert.message}
        type={modal.alert.type}
        title={modal.alert.title}
      />
    </main>
  );
};
