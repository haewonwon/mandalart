import { DashboardGrid } from '@/widgets/dashboard/ui/DashboardGrid';
import {
  defaultDashboardCards,
  dashboardStatusMessage,
} from '@/widgets/dashboard/model/dashboardData';

export const DashboardPage = () => {
  return (
    <main className="flex flex-1 justify-center bg-slate-50 px-4 py-10 sm:px-6 sm:py-12">
      <div className="w-full max-w-6xl space-y-10">
        <DashboardGrid
          nickname="08Muhan"
          statusMessage={dashboardStatusMessage}
          cards={defaultDashboardCards}
        />
      </div>
    </main>
  );
};
