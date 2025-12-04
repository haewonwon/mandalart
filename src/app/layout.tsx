import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/widgets/header/ui/Header';

export const metadata: Metadata = {
  title: {
    template: '%s | 08.MANDALART',
    default: '08.MANDALART',
  },

  description: '공팔무한의 무한한 확장을 위한 만다라트 플래너 & 아카이브',

  keywords: ['공팔무한', '만다라트', '0800', 'Mandalart'],

  authors: [{ name: '0800' }],

  openGraph: {
    title: '08.MANDALART',
    description: 'Expand your vision with Infinite Grid.',
    type: 'website',
    locale: 'ko_KR',
    siteName: '08.MANDALART',
    // images: [ ... ] // 나중에 썸네일 이미지 생기면 추가하세요!
  },

  // 6. 아이콘 (favicon)
  icons: {
    icon: '/favicon.ico', // public 폴더에 아이콘 파일이 있다면
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col bg-white text-slate-900 antialiased">
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
