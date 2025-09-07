import { Metadata } from 'next';
import ServicesPage from '@/components/ServicesPage';
import { generateSEOMetadata } from '@/components/shared/SEO';

export const metadata: Metadata = generateSEOMetadata({
  title: "Professional Logistics Services - Air, Ocean & Ground Freight",
  description: "Comprehensive China-Vietnam logistics services including air freight, ocean freight, ground transportation, warehousing, customs clearance, and cargo insurance.",
  keywords: [
    'logistics services',
    'air freight China Vietnam',
    'ocean freight shipping',
    'ground transportation',
    'warehousing services',
    'customs clearance',
    'cargo insurance'
  ]
});

export default function Services() {
  return <ServicesPage />;
}