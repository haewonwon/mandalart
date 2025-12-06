/**
 * 만다라트 공유 토큰 생성
 * 만다라트 ID와 현재 시간을 기반으로 간단한 토큰 생성
 */
export const generateShareToken = (mandalartId: string): string => {
  // 간단한 해시 함수 (실제로는 더 안전한 방법 사용 권장)
  const timestamp = Date.now();
  const combined = `${mandalartId}-${timestamp}`;
  
  // Base64 인코딩 (URL-safe)
  return Buffer.from(combined).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

/**
 * 공유 토큰에서 만다라트 ID 추출
 */
export const extractMandalartIdFromToken = (token: string): string | null => {
  try {
    // Base64 디코딩 (패딩 추가)
    let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    // 패딩 추가 (Base64는 4의 배수여야 함)
    while (base64.length % 4) {
      base64 += '=';
    }
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    
    // 마지막 하이픈 이후는 타임스탬프이므로, 마지막 하이픈을 기준으로 분리
    const lastHyphenIndex = decoded.lastIndexOf('-');
    if (lastHyphenIndex === -1) {
      return null;
    }
    
    // 마지막 하이픈 이전까지가 만다라트 ID
    const mandalartId = decoded.substring(0, lastHyphenIndex);
    return mandalartId || null;
  } catch (error) {
    console.error('Token extraction error:', error);
    return null;
  }
};

