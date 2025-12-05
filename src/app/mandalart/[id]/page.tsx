import { MandalartDetailPage } from '@/views/mandalart-detail/ui/MandalartDetailPage';

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  return <MandalartDetailPage params={params} />;
}
