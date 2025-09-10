import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { generateSEOMetadata, generateStructuredData } from '@/components/shared/SEO';
import ReduxProvider from '@/components/ReduxProvider';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = generateSEOMetadata({
  title: "Huang Shan Global - Professional China-Vietnam Logistics Solutions",
  description: "Leading logistics company specializing in China-Vietnam import-export trade. Fast, reliable, and secure freight services with comprehensive customs clearance and warehousing solutions.",
  keywords: [
    'China Vietnam logistics',
    'import export trading',
    'freight forwarding',
    'customs clearance',
    'warehouse management',
    'air freight',
    'ocean freight',
    'ground transportation'
  ]
});

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  const organizationData = generateStructuredData('Organization', {});
  const websiteData = generateStructuredData('WebSite', {});

  return (
    <html lang="vi">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationData)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteData)
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ReduxProvider>
          <LanguageProvider>
            <ToastProvider>
              <Header />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
            </ToastProvider>
          </LanguageProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}