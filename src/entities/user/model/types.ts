/**
 * 사용자 프로필 타입
 * @description auth.users와 매핑되는 기본 프로필 정보
 */
export interface Profile {
  id: string; // auth.users의 id와 동일
  email: string;
  nickname: string;
}
