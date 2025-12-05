import { MandalartDetailPage } from '@/pages/mandalart-detail/ui/MandalartDetailPage';

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  return <MandalartDetailPage params={params} />;
}
