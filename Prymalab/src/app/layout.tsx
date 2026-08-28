import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import GrowthAnalytics from '@/components/analytics/GrowthAnalytics';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/seo';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#102F35',
  colorScheme: 'light',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} | Dinh dưỡng & giấc ngủ cá nhân hóa`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['PrymaLab Việt Nam', 'dinh dưỡng và giấc ngủ', 'cải thiện chất lượng giấc ngủ', 'dinh dưỡng cá nhân hóa', 'nhịp sống lành mạnh', 'TDEE'],
  authors: [{ name: `Ban biên tập ${SITE_NAME}`, url: `${SITE_URL}/chinh-sach-bien-tap` }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  category: 'health',
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  alternates: {
    types: {
      'application/rss+xml': `${SITE_URL}/rss.xml`,
    },
  },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    title: `${SITE_NAME} | Ăn đúng nhịp. Ngủ sâu hơn.`,
    description: 'Một lộ trình cá nhân kết nối dinh dưỡng, giấc ngủ và năng lượng — để bạn biết hôm nay nên bắt đầu từ đâu.',
    url: '/',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1731,
        height: 909,
        alt: `${SITE_NAME} — Ăn đúng nhịp. Ngủ sâu hơn.`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Ăn đúng nhịp. Ngủ sâu hơn.`,
    description: 'Một lộ trình cá nhân kết nối dinh dưỡng, giấc ngủ và năng lượng.',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <AuthProvider>
          <GrowthAnalytics />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
