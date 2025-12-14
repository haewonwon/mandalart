import { DashboardYearPage } from '@/views/dashboard-year/ui/DashboardYearPage.server';

type Props = {
  params: {
    year: string;
  };
};

export default function Page({ params }: Props) {
  return <DashboardYearPage params={params} />;
}
