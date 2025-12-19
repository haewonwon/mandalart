import { MandalartSharePage } from '@/views/mandalart-share/ui/MandalartSharePage';
import { extractMandalartIdFromToken } from '@/shared/lib';

type Props = {
  params: Promise<{
    id: string; // share token
  }>;
};

export default async function SharePage({ params }: Props) {
  const awaitedParams = await params;
  
  // 토큰에서 만다라트 ID 추출
  const mandalartId = extractMandalartIdFromToken(awaitedParams.id);
  
  // 토큰이 유효하지 않으면 에러 페이지 표시 (리다이렉트하지 않음)
  // 공개 페이지이므로 접근은 허용하되, 데이터가 없으면 에러 메시지 표시
  
  return <MandalartSharePage mandalartId={mandalartId || ''} shareToken={awaitedParams.id} />;
}

