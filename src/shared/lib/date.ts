/**
 * 상대 시간 포맷팅
 * @param dateString - ISO 날짜 문자열
 * @returns 포맷된 시간 문자열 ("방금 전", "3분 전", "2025.12.06" 등)
 * @description 날짜를 현재 시간 기준 상대 시간으로 변환. 7일 이상 지난 경우 날짜 형식으로 표시
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000; // 초 단위 차이

  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;

  // 오래된 건 깔끔하게 날짜로 (2025.12.06)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .replace(/\.$/, ''); // 끝에 점 제거
}
