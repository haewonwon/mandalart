import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/widgets/header/ui/Header';
import { ReactQueryProvider } from '@/shared/lib/react-query/ReactQueryProvider';

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
    description: 'Expand your vision with 0800 Mandalart.',
    type: 'website',
    locale: 'ko_KR',
    siteName: '08.MANDALART',
    images: ['/mandalart_logo.svg'],
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
        <ReactQueryProvider>
          <Header />
          <div className="flex flex-1 flex-col">{children}</div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
