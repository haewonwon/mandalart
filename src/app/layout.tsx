import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/widgets/header/ui/Header';
import { ReactQueryProvider } from '@/shared/lib/react-query/ReactQueryProvider';
import { BanCheckProvider } from '@/shared/components/BanCheckProvider';

export const metadata: Metadata = {
  title: {
    template: '%s | MANDA',
    default: 'MANDA',
  },

  description: 'Expand your vision with MANDA.',

  keywords: ['공팔무한', '만다라트', '0800', 'Mandalart', 'MANDA'],

  authors: [{ name: '0800' }],

  openGraph: {
    title: 'MANDA',
    description: 'Expand your vision with MANDA.',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'MANDA',
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
          <BanCheckProvider>
            <Header />
            <div className="flex flex-1 flex-col">{children}</div>
          </BanCheckProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
