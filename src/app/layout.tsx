import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '만달아트',
  description: '만달아트 구성 도구',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
