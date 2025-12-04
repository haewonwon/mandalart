export type DemoTone = {
  headingText: string;
  baseBg: string;
  baseText: string;
  baseBorder: string;
  highlightBg: string;
  highlightText: string;
  highlightBorder: string;
};

export type DemoTheme = {
  title: string;
  centerGoal: string;
  aroundGoals: string[];
};

const createTheme = (title: string, centerGoal: string, aroundGoals: string[]): DemoTheme => ({
  title,
  centerGoal,
  aroundGoals,
});

// 채도를 낮춘 모노톤 팔레트
export const DEMO_COLORS: DemoTone[] = [
  {
    headingText: 'text-slate-900',
    baseBg: 'bg-slate-50',
    baseText: 'text-slate-800',
    baseBorder: 'border-slate-200',
    highlightBg: 'bg-slate-800',
    highlightText: 'text-white',
    highlightBorder: 'border-slate-800',
  },
  {
    headingText: 'text-zinc-900',
    baseBg: 'bg-zinc-50',
    baseText: 'text-zinc-800',
    baseBorder: 'border-zinc-200',
    highlightBg: 'bg-zinc-800',
    highlightText: 'text-white',
    highlightBorder: 'border-zinc-800',
  },
  {
    headingText: 'text-stone-900',
    baseBg: 'bg-stone-50',
    baseText: 'text-stone-800',
    baseBorder: 'border-stone-200',
    highlightBg: 'bg-stone-800',
    highlightText: 'text-white',
    highlightBorder: 'border-stone-800',
  },
  {
    headingText: 'text-gray-900',
    baseBg: 'bg-gray-50',
    baseText: 'text-gray-800',
    baseBorder: 'border-gray-200',
    highlightBg: 'bg-gray-800',
    highlightText: 'text-white',
    highlightBorder: 'border-gray-800',
  },
];

// 보여줄 테마 세트 (타이틀 + 9개 키워드)
export const DEMO_THEMES: DemoTheme[] = [
  createTheme('긴 호흡으로 여는 아침 루틴', '따뜻한 출근길', [
    '물 한 컵',
    '기상 스트레칭',
    '창문 활짝',
    '핸드폰 금지',
    '감사 메모',
    '건강한 아침식사',
    '오늘의 한 문장',
    '로파이 음악',
  ]),
  createTheme('주말 감성 충전 캡슐', '일요일 저녁 리셋', [
    '방 산뜻하게',
    '향초 켜기',
    '애정 듬뿍 브런치',
    '카메라 들고 산책',
    '초록 식물 손질',
    '안부 메시지 전송',
    '저널 쓰기',
    '다음 주 계획 세우기',
  ]),
  createTheme('느긋하지만 꾸준한 성장기록', '다음 달 준비 완료', [
    '다짐 한 줄',
    '온라인 레슨 수강',
    '하이라이트 노트',
    '책 한 권 읽기',
    '프로젝트 기록',
    '한 주 돌아보기',
    '멘토에게 질문',
    '새 취미 한 번 체험',
  ]),
  createTheme('부드럽게 회복하는 웰니스 플랜', '일찍 잠들기', [
    '깊은 호흡 다섯 번',
    '30분 온전한 휴식',
    '가벼운 요가',
    '물 2리터',
    '디지털 디톡스',
    '맘에 드는 한 끼',
    '저녁 산책',
    '감사 노트',
  ]),
];
