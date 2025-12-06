import { getDashboardData } from '@/features/dashboard/model/getDashboardData';
import { DashboardGrid } from '@/widgets/dashboard/ui/DashboardGrid';
import { WelcomeSection } from '@/widgets/dashboard/ui/WelcomeSection';

export const DashboardPage = async () => {
  const { nickname, mandalarts, lastUpdatedAt, lastUpdatedYear } = await getDashboardData();

  return (
    <main className="flex flex-1 justify-center bg-slate-50 px-4 py-10 sm:px-6 sm:py-12">
      <div className="w-full max-w-6xl space-y-10">
        {/* 상단 인사말 섹션 */}
        <WelcomeSection nickname={nickname} count={mandalarts.length} lastUpdatedAt={lastUpdatedAt} lastUpdatedYear={lastUpdatedYear} />

        {/* 그리드 위젯 (데이터 주입) */}
        <DashboardGrid mandalarts={mandalarts} />
      </div>
    </main>
  );
};
