import { Metadata } from 'next';
import ContactPageAPI from '@/components/ContactPageAPI';
import { generateSEOMetadata } from '@/components/shared/SEO';

export const metadata: Metadata = generateSEOMetadata({
  title: "Contact Us - Huang Shan Global Logistics Services",
  description: "Get in touch with Huang Shan Global for professional China-Vietnam logistics solutions. 24/7 customer support, free quotes, and expert logistics consultation.",
  keywords: [
    'contact logistics company',
    'China Vietnam shipping quote',
    'logistics consultation',
    'freight forwarding contact',
    'import export help'
  ]
});

export default function Contact() {
  return <ContactPageAPI />;
}