/**
 * @param request - 요청 객체
 * @param params - 파라미터 객체
 * @returns 리다이렉트 응답
 * @description 공유 링크를 통해 접근한 경우 쿠키 설정
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { extractMandalartIdFromToken } from '@/shared/lib';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const awaitedParams = await params;
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get('ref');

  // 토큰에서 만다라트 ID 추출
  const mandalartId = extractMandalartIdFromToken(awaitedParams.id);

  if (!mandalartId) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const cookieStore = await cookies();

  // 공유 링크를 통해 접근한 경우 쿠키 설정
  if (ref === 'share') {
    cookieStore.set(`share_${awaitedParams.id}`, '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24시간
    });
  } else {
    // ref 파라미터가 없으면 쿠키 확인
    const shareCookie = cookieStore.get(`share_${awaitedParams.id}`);
    if (!shareCookie) {
      // 쿠키가 없으면 직접 접근으로 간주하고 차단
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // 쿠키 설정 후 공유 페이지로 리다이렉트 (쿼리 파라미터 제거)
  return NextResponse.redirect(new URL(`/share/${awaitedParams.id}`, request.url));
}
