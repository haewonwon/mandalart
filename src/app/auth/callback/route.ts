import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const next = searchParams.get('next') ?? '/';

  // 프로덕션 환경에서도 올바른 도메인 사용
  // 환경 변수가 설정되어 있고 localhost가 아니면 환경 변수 사용, 아니면 요청의 origin 사용
  const currentOrigin = process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.includes('localhost')
    ? process.env.NEXT_PUBLIC_BASE_URL
    : origin;

  // OAuth provider에서 직접 에러를 반환한 경우
  if (error) {
    console.error('OAuth callback error:', error, errorDescription);
    const errorUrl = new URL(`${currentOrigin}/auth/auth-code-error`);
    errorUrl.searchParams.set('error', error);
    if (errorDescription) {
      errorUrl.searchParams.set('error_description', errorDescription);
    }
    return NextResponse.redirect(errorUrl.toString());
  }

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      return NextResponse.redirect(`${currentOrigin}${next}`);
    }

    // 세션 교환 실패 시 에러 로깅 및 리디렉션
    console.error('Session exchange error:', exchangeError);
    const errorUrl = new URL(`${currentOrigin}/auth/auth-code-error`);
    errorUrl.searchParams.set('error', exchangeError.message || 'session_exchange_failed');
    if (exchangeError.status) {
      errorUrl.searchParams.set('error_description', `Status: ${exchangeError.status}`);
    }
    return NextResponse.redirect(errorUrl.toString());
  }

  // code가 없는 경우
  console.error('OAuth callback: No code parameter');
  const errorUrl = new URL(`${currentOrigin}/auth/auth-code-error`);
  errorUrl.searchParams.set('error', 'no_code');
  errorUrl.searchParams.set('error_description', '인증 코드가 제공되지 않았습니다.');
  return NextResponse.redirect(errorUrl.toString());
}
