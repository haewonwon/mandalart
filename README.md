# MANDA

만다라트 기반 목표 관리 웹 애플리케이션

<div style="background-color: white; display: inline-block; padding: 16px; border-radius: 4px;">
  <img src="./public/mandalart_logo.svg" alt="MANDA Logo" width="200" />
</div>

## 시작하기

```bash
npm install
npm run dev
```

`.env.local` 파일에 다음 환경 변수를 설정하세요:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BASE_URL=your_base_url
```

**환경별 설정:**

- 로컬: `NEXT_PUBLIC_BASE_URL`은 설정하지 않아도 됩니다 (자동으로 `localhost:3000` 사용)
- 개발: `NEXT_PUBLIC_BASE_URL=https://0800mandalart-git-develop-haewonwons-projects.vercel.app`
- 운영: `NEXT_PUBLIC_BASE_URL=https://manda.gongpalmuhan.com`

## 기능

- 만다라트 생성 및 편집 (핵심 목표, 세부 목표, 실천과제)
- 연도별 만다라트 관리
- 만다라트 재배치 (드래그 앤 드롭)
- 이미지/PDF 내보내기
- 만다라트 공유
- 버전 관리

## 기술 스택

- Next.js 16
- React 19
- TypeScript
- Supabase
- Tailwind CSS
- React Query
