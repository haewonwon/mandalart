'use client';

import { Users, FileText, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useAdminStats } from '@/features/admin/model/useAdminStats';

export const AdminDashboardSection = () => {
  const { stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  const statCards = [
    {
      title: '총 가입 유저 수',
      value: stats.userCount.toLocaleString(),
      icon: Users,
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/20',
    },
    {
      title: '생성된 만다라트 수',
      value: stats.mandalartCount.toLocaleString(),
      icon: FileText,
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/20',
    },
    {
      title: '오늘의 가입자',
      value: stats.todaySignups.toLocaleString(),
      icon: UserPlus,
      bgColor: stats.todaySignups > 0 ? 'bg-emerald-500/10' : 'bg-slate-700/50',
      iconColor: stats.todaySignups > 0 ? 'text-emerald-400' : 'text-slate-400',
      borderColor: stats.todaySignups > 0 ? 'border-emerald-500/20' : 'border-slate-600/50',
    },
    {
      title: '미해결 티켓',
      value: stats.pendingFeedback.toLocaleString(),
      icon: AlertCircle,
      bgColor: stats.pendingFeedback > 0 ? 'bg-amber-500/10' : 'bg-slate-700/50',
      iconColor: stats.pendingFeedback > 0 ? 'text-amber-400' : 'text-slate-400',
      borderColor: stats.pendingFeedback > 0 ? 'border-amber-500/20' : 'border-slate-600/50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`rounded-xl border ${card.borderColor} ${card.bgColor} p-6 transition-all hover:scale-[1.02] hover:shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{card.title}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-100">{card.value}</p>
                </div>
                <div className={`rounded-xl p-3 ${card.bgColor} border ${card.borderColor}`}>
                  <Icon size={24} className={card.iconColor} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

