import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Thiệp 20/10 dành tặng bạn 🌷', description: 'Một món quà nhỏ nhân ngày Phụ nữ Việt Nam 20/10' };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500&family=Playfair+Display:ital,wght@0,500;0,700;1,500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
