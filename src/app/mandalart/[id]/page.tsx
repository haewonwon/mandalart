import { MandalartDetailPage } from '@/views/mandalart-detail/ui/MandalartDetailPage';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <MandalartDetailPage params={{ id }} />;
}
