import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/widgets/header/ui/Header';
import { ReactQueryProvider } from '@/app/providers/ReactQueryProvider';
import { BanCheckProvider } from '@/app/providers/BanCheckProvider';

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

  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/favicon/apple-touch-icon.png',
      },
    ],
  },
  manifest: '/favicon/site.webmanifest',
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
