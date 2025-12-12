'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Bug,
  Lightbulb,
  MessageSquare,
  CheckCircle2,
  Clock,
  Mail,
  Loader2,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { createClient } from '@/shared/lib/supabase/client';
import { useModal } from '@/shared/hooks/useModal';
import { AlertModal } from '@/shared/ui/AlertModal';

interface Ticket {
  id: string;
  content: string;
  category: string;
  images: string[] | null;
  is_resolved: boolean;
  created_at: string;
  profiles: {
    nickname: string | null;
    email: string | null;
  } | null;
}

type CategoryFilter = 'ALL' | 'BUG' | 'FEATURE' | 'INQUIRY' | 'APPEAL' | 'OTHER';
type StatusFilter = 'PENDING' | 'RESOLVED' | 'ALL';

export const AdminFeedbackSection = () => {
  const supabase = createClient();
  const modal = useModal();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('PENDING');

  useEffect(() => {
    fetchTickets();
  }, [categoryFilter, statusFilter]);

  const fetchTickets = async () => {
    setLoading(true);

    let query = supabase.from('tickets').select(
      `
        *,
        profiles (nickname, email)
      `
    );

    // 카테고리 필터 적용
    if (categoryFilter !== 'ALL') {
      if (categoryFilter === 'BUG') {
        query = query.eq('category', 'BUG');
      } else if (categoryFilter === 'FEATURE') {
        query = query.eq('category', 'FEATURE');
      } else if (categoryFilter === 'INQUIRY') {
        query = query.eq('category', 'INQUIRY');
      } else if (categoryFilter === 'APPEAL') {
        query = query.eq('category', 'APPEAL');
      } else if (categoryFilter === 'OTHER') {
        query = query
          .not('category', 'eq', 'BUG')
          .not('category', 'eq', 'FEATURE')
          .not('category', 'eq', 'INQUIRY')
          .not('category', 'eq', 'APPEAL');
      }
    }

    // 상태 필터 적용
    if (statusFilter === 'PENDING') {
      query = query.eq('is_resolved', false);
    } else if (statusFilter === 'RESOLVED') {
      query = query.eq('is_resolved', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      modal.alert.show({
        type: 'error',
        message: '티켓을 불러오는 중 오류가 발생했습니다.',
      });
    } else {
      setTickets(data as any);
    }

    setLoading(false);
  };

  const toggleResolved = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('tickets')
      .update({ is_resolved: !currentStatus })
      .eq('id', id);

    if (error) {
      modal.alert.show({
        type: 'error',
        message: '상태 변경 중 오류가 발생했습니다.',
      });
    } else {
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_resolved: !currentStatus } : t))
      );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'BUG':
        return Bug;
      case 'FEATURE':
        return Lightbulb;
      case 'INQUIRY':
        return HelpCircle;
      case 'APPEAL':
        return AlertCircle;
      default:
        return MessageSquare;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'BUG':
        return '버그';
      case 'FEATURE':
        return '제안';
      case 'INQUIRY':
        return '문의';
      case 'APPEAL':
        return '소명';
      default:
        return '기타';
    }
  };

  // API에서 이미 필터링된 데이터를 사용
  const filteredTickets = tickets;

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
        {/* 필터 탭 */}
        <div className="flex flex-wrap gap-2 border-b border-slate-700/50 pb-4">
          <div className="flex gap-2">
            <span className="text-sm font-medium text-slate-300 py-2">카테고리:</span>
            {(['ALL', 'BUG', 'FEATURE', 'INQUIRY', 'APPEAL', 'OTHER'] as CategoryFilter[]).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    categoryFilter === cat
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50'
                  }`}
                >
                  {cat === 'ALL'
                    ? '전체'
                    : cat === 'BUG'
                    ? '버그'
                    : cat === 'FEATURE'
                    ? '제안'
                    : cat === 'INQUIRY'
                    ? '문의'
                    : cat === 'APPEAL'
                    ? '소명'
                    : cat === 'OTHER'
                    ? '기타'
                    : '전체'}
                </button>
              )
            )}
          </div>
          <div className="flex gap-2 ml-auto">
            <span className="text-sm font-medium text-slate-300 py-2">상태:</span>
            {(['PENDING', 'RESOLVED', 'ALL'] as StatusFilter[]).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50'
                }`}
              >
                {status === 'PENDING' ? '미해결' : status === 'RESOLVED' ? '해결됨' : '전체'}
              </button>
            ))}
          </div>
        </div>

        {/* 티켓 리스트 */}
        {filteredTickets.length === 0 ? (
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 px-6 py-12 text-center">
            <p className="text-slate-400">표시할 티켓이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((item) => {
              const CategoryIcon = getCategoryIcon(item.category);
              const categoryLabel = getCategoryLabel(item.category);
              const date = new Date(item.created_at).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border px-6 py-5 transition-all ${
                    item.is_resolved
                      ? 'bg-slate-800/30 border-slate-700/30 opacity-60'
                      : 'bg-slate-800/50 border-slate-700/50 shadow-lg hover:shadow-xl hover:border-slate-600/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div
                        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium border ${
                          item.category === 'BUG'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : item.category === 'FEATURE'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : item.category === 'INQUIRY'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : item.category === 'APPEAL'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-slate-700/50 text-slate-300 border-slate-600/50'
                        }`}
                      >
                        <CategoryIcon size={16} />
                        {categoryLabel}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="text-sm text-slate-400">
                          <span className="font-medium text-slate-300">
                            {item.profiles?.nickname || '익명'}
                          </span>
                          <span className="mx-2 text-slate-500">·</span>
                          <span>{date}</span>
                        </div>
                        {item.profiles?.email && (
                          <a
                            href={`mailto:${item.profiles.email}`}
                            className="text-sm text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Mail size={14} />
                            {item.profiles.email}
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleResolved(item.id, item.is_resolved)}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors border ${
                        item.is_resolved
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-700'
                      }`}
                    >
                      {item.is_resolved ? (
                        <>
                          <CheckCircle2 size={16} />
                          해결 완료
                        </>
                      ) : (
                        <>
                          <Clock size={16} />
                          대기 중
                        </>
                      )}
                    </button>
                  </div>

                  <p className="whitespace-pre-wrap text-slate-200 mb-4 leading-relaxed">
                    {item.content}
                  </p>

                  {/* 첨부 이미지 보기 */}
                  {item.images && item.images.length > 0 && (
                    <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                      {item.images.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-lg border border-slate-700/50 overflow-hidden bg-slate-700/30"
                        >
                          <Image
                            src={url}
                            alt={`첨부 이미지 ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AlertModal
        isOpen={modal.alert.isOpen}
        onClose={modal.alert.hide}
        message={modal.alert.message}
        type={modal.alert.type}
        title={modal.alert.title}
      />
    </>
  );
};
