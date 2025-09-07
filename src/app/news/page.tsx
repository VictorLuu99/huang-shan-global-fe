import { Metadata } from 'next';
import NewsPageAPI from '@/components/NewsPageAPI';
import { generateSEOMetadata } from '@/components/shared/SEO';

export const metadata: Metadata = generateSEOMetadata({
  title: "Latest News - Huang Shan Global Logistics Updates",
  description: "Stay updated with the latest news from Huang Shan Global and the China-Vietnam logistics industry. Company announcements, industry insights, and trade regulations.",
  keywords: [
    'logistics news',
    'China Vietnam trade news',
    'import export updates',
    'industry regulations',
    'company announcements',
    'trade news'
  ]
});

export default function News() {
  return <NewsPageAPI />;
}