/**
 * API 모듈 인덱스
 * @description 클라이언트 및 서버용 API 함수들을 export합니다.
 * - Client APIs: 브라우저에서 사용하는 API (use client 컴포넌트)
 * - Server APIs: 서버 컴포넌트에서 사용하는 API
 */

// Client APIs
export { getAllMandalarts } from './client/getAllMandalarts';

export { getRecentMandalart } from './client/getRecentMandalart';

export { getMandalartVersions } from './client/getMandalartVersions';

export { getMandalart } from './client/getMandalart';

export { getMandalartForShare } from './client/getMandalartForShare';

export { createMandalart } from './client/createMandalart';

export { updateMandalart } from './client/updateMandalart';

export { deleteMandalart } from './client/deleteMandalart';

export { getProfile } from './client/getProfile';

export { updateProfile } from './client/updateProfile';

// Server APIs
export { getMandalarts as getMandalartsServer } from './server/getMandalarts.server';

export { getProfileNickname as getProfileNicknameServer } from './server/getProfileNickname.server';
