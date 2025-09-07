import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { generateSEOMetadata, generateStructuredData } from '@/components/shared/SEO';

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
  params: Promise<{locale: string}>;
};

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const {locale} = await params;
  const messages = await getMessages();

  const organizationData = generateStructuredData('Organization', {});
  const websiteData = generateStructuredData('WebSite', {});

  return (
    <html lang={locale}>
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
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}