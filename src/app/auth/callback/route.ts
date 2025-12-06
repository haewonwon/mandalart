import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const next = requestUrl.searchParams.get('next') ?? '/';

  // 실제 요청이 온 origin을 사용 (localhost면 localhost, 프로덕션이면 프로덕션)
  // requestUrl.origin을 우선 사용하여 로컬/프로덕션 자동 감지
  const currentOrigin = requestUrl.origin;

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
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch (error) {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
              console.error('Error setting cookies:', error);
            }
          },
        },
      }
    );

    // exchangeCodeForSession은 쿠키에서 자동으로 code_verifier를 읽어옵니다
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      // 성공 시 리디렉션
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
