import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonicalUrl?: string;
  noIndex?: boolean;
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  ogImage = '/images/og-default.jpg',
  ogType = 'website',
  canonicalUrl,
  noIndex = false
}: SEOProps): Metadata {
  const siteName = 'Huang Shan Global';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  
  const defaultKeywords = [
    'logistics',
    'shipping',
    'freight',
    'import export',
    'China Vietnam trade',
    'cargo transport',
    'supply chain',
    'warehouse',
    'customs clearance'
  ];

  const allKeywords = [...new Set([...keywords, ...defaultKeywords])];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords.join(', '),
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'vi': '/vi',
        'en': '/en',
        'zh': '/zh'
      }
    },
    openGraph: {
      title: fullTitle,
      description,
      type: ogType,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage]
    },
    other: {
      'application-name': siteName,
      'apple-mobile-web-app-title': siteName,
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'format-detection': 'telephone=no'
    }
  };
}

export function generateStructuredData(type: 'Organization' | 'WebSite' | 'Article', data: Record<string, unknown> = {}) {
  const baseUrl = 'https://huang-shan-global-fe.pages.dev'; // Update with actual domain
  
  switch (type) {
    case 'Organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Huang Shan Global',
        alternateName: 'HUANG SHAN GLOBAL IMPORT-EXPORT TRADING JOINT STOCK COMPANY',
        url: baseUrl,
        logo: `${baseUrl}/images/logo.jpg`,
        description: 'Leading logistics and import-export company specializing in China-Vietnam trade',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'C38-30, Block C Geleximco, Duong Noi',
          addressLocality: 'Ha Dong',
          addressRegion: 'Hanoi',
          addressCountry: 'VN'
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+84-38-959-1238',
            contactType: 'customer service',
            availableLanguage: ['Vietnamese', 'Chinese', 'English']
          }
        ],
        sameAs: [
          // Add social media URLs here when available
        ],
        ...data
      };

    case 'WebSite':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Huang Shan Global',
        url: baseUrl,
        description: 'Professional logistics and import-export services for China-Vietnam trade',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        },
        ...data
      };

    case 'Article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        publisher: {
          '@type': 'Organization',
          name: 'Huang Shan Global',
          logo: `${baseUrl}/images/logo.jpg`
        },
        ...data
      };

    default:
      return null;
  }
}