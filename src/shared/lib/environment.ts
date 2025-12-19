/**
 * 현재 환경의 Base URL 반환
 * @returns Base URL 문자열
 * @description 브라우저/서버 환경에 따라 적절한 Base URL 반환. Vercel 환경 자동 감지
 */
export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Vercel 배포 환경 (자동으로 제공됨, https 미포함이므로 붙여줘야 함)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 사용자가 명시적으로 설정한 URL (Prod 운영 서버 등)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // 로컬 개발 환경 폴백
  return 'http://localhost:3000';
};

/**
 * OAuth 인증 리다이렉트 URL 생성
 * @returns 인증 콜백 URL
 * @description OAuth 로그인 후 리다이렉트될 URL 반환
 */
export const getAuthRedirectUrl = () => {
  return `${getBaseUrl()}/auth/callback`;
};
