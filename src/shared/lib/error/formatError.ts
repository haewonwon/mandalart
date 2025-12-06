/**
 * 서버에서 받은 에러를 사용자 친화적인 메시지로 변환
 */
export const formatError = (error: any, defaultMessage: string = '오류가 발생했습니다.'): string => {
  // 에러가 없으면 기본 메시지 반환
  if (!error) {
    return defaultMessage;
  }

  // 이미 문자열인 경우 (일반 에러 메시지)
  if (typeof error === 'string') {
    return error;
  }

  // Supabase 에러 처리
  if (error.code) {
    switch (error.code) {
      case 'PGRST116':
        return '요청한 데이터를 찾을 수 없습니다.';
      case 'PGRST202':
        return '잘못된 요청입니다. 다시 시도해주세요.';
      case '23505': // unique_violation
        return '이미 존재하는 데이터입니다.';
      case '23503': // foreign_key_violation
        return '관련된 데이터가 있어 처리할 수 없습니다.';
      case '42501': // insufficient_privilege
        return '권한이 없습니다.';
      case 'PGRST301': // Multiple rows returned
        return '데이터 처리 중 오류가 발생했습니다.';
      default:
        // 알 수 없는 Supabase 에러 코드인 경우
        if (error.message) {
          // 에러 메시지가 있으면 기본 메시지로 반환
          return defaultMessage;
        }
    }
  }

  // Error 객체인 경우
  if (error instanceof Error) {
    // 사용자 정의 에러 메시지가 있는 경우
    const userFriendlyMessages: Record<string, string> = {
      'No user found': '로그인이 필요합니다.',
      '로그인이 필요합니다.': '로그인이 필요합니다.',
      '데이터가 부족합니다.': '필수 정보가 누락되었습니다.',
      '데이터가 없습니다.': '데이터를 찾을 수 없습니다.',
    };

    const message = error.message;
    if (userFriendlyMessages[message]) {
      return userFriendlyMessages[message];
    }

    // 일반적인 에러 메시지 패턴 처리
    if (message.includes('network') || message.includes('fetch')) {
      return '네트워크 오류가 발생했습니다. 연결을 확인해주세요.';
    }
    if (message.includes('timeout')) {
      return '요청 시간이 초과되었습니다. 다시 시도해주세요.';
    }
    if (message.includes('unauthorized') || message.includes('401')) {
      return '인증이 필요합니다. 다시 로그인해주세요.';
    }
    if (message.includes('forbidden') || message.includes('403')) {
      return '접근 권한이 없습니다.';
    }
    if (message.includes('not found') || message.includes('404')) {
      return '요청한 데이터를 찾을 수 없습니다.';
    }
    if (message.includes('server') || message.includes('500')) {
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }

    // 그 외의 경우 기본 메시지 반환
    return defaultMessage;
  }

  // error.message가 있는 경우
  if (error.message) {
    // 위의 Error 객체 처리와 동일한 로직 적용
    const userFriendlyMessages: Record<string, string> = {
      'No user found': '로그인이 필요합니다.',
      '로그인이 필요합니다.': '로그인이 필요합니다.',
      '데이터가 부족합니다.': '필수 정보가 누락되었습니다.',
      '데이터가 없습니다.': '데이터를 찾을 수 없습니다.',
    };

    if (userFriendlyMessages[error.message]) {
      return userFriendlyMessages[error.message];
    }

    // 네트워크, 타임아웃 등 일반적인 에러 패턴 처리
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return '네트워크 오류가 발생했습니다. 연결을 확인해주세요.';
    }
    if (error.message.includes('timeout')) {
      return '요청 시간이 초과되었습니다. 다시 시도해주세요.';
    }
    if (error.message.includes('unauthorized') || error.message.includes('401')) {
      return '인증이 필요합니다. 다시 로그인해주세요.';
    }
    if (error.message.includes('forbidden') || error.message.includes('403')) {
      return '접근 권한이 없습니다.';
    }
    if (error.message.includes('not found') || error.message.includes('404')) {
      return '요청한 데이터를 찾을 수 없습니다.';
    }
    if (error.message.includes('server') || error.message.includes('500')) {
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }

    // 그 외의 경우 기본 메시지 반환
    return defaultMessage;
  }

  // 모든 경우에 해당하지 않으면 기본 메시지 반환
  return defaultMessage;
};

