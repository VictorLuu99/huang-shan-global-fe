import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NewsDetailPage from '@/components/NewsDetailPage';
import { newsService } from '@/services/newsService';

// Force dynamic rendering for this route since it uses searchParams
export const dynamic = 'force-dynamic';

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    lang?: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params, 
  searchParams 
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { lang } = await searchParams;
  const currentLang = lang || 'vn';

  try {
    const response = await newsService.getNewsBySlug(slug, currentLang);
    
    if (!response.success || !response.data) {
      return {
        title: 'News Article Not Found - Huang Shan Global',
        description: 'The requested news article could not be found.',
      };
    }

    const post = response.data;
    const title = post.title || 'News Article';
    const description = post.excerpt || `Read the latest news from Huang Shan Global: ${title}`;

    return {
      title: `${title} - Huang Shan Global News`,
      description: description,
      keywords: [
        'logistics news',
        'China Vietnam logistics',
        'shipping news',
        'industry updates',
        'company news',
        post.category || 'logistics',
        title.toLowerCase()
      ],
      openGraph: {
        title: `${title} - Huang Shan Global`,
        description: description,
        type: 'article',
        url: `https://huang-shan-global-fe.pages.dev/news/${slug}`,
        images: post.image_url ? [
          {
            url: post.image_url,
            width: 1200,
            height: 630,
            alt: title,
          }
        ] : [
          {
            url: '/images/og-default.jpg',
            width: 1200,
            height: 630,
            alt: 'Huang Shan Global News',
          }
        ],
        publishedTime: post.created_at,
        section: post.category || 'News',
        tags: [post.category || 'logistics', 'China', 'Vietnam', 'shipping', 'news'],
        authors: post.author ? [post.author] : ['Huang Shan Global'],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} - Huang Shan Global`,
        description: description,
        images: post.image_url ? [post.image_url] : ['/images/og-default.jpg'],
      },
      alternates: {
        canonical: `https://huang-shan-global-fe.pages.dev/news/${slug}`,
        languages: {
          'vi': `/news/${slug}?lang=vn`,
          'zh': `/news/${slug}?lang=cn`,
          'en': `/news/${slug}?lang=en`,
        },
      },
      other: {
        'article:author': post.author || 'Huang Shan Global',
        'article:section': post.category || 'News',
        'article:tag': [post.category || 'logistics', 'shipping', 'news'].join(','),
        'article:published_time': post.created_at,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for news post:', error);
    
    return {
      title: 'News Article - Huang Shan Global',
      description: 'Stay updated with the latest news from Huang Shan Global.',
    };
  }
}

// Generate static params for better performance (optional)
export async function generateStaticParams() {
  try {
    // Fetch all news articles to pre-generate slug-based routes
    const response = await newsService.getNews({ limit: 100 });
    
    if (response.success && response.data) {
      // Only return posts that have slugs (filter out null/undefined slugs)
      return response.data
        .filter((post) => post.slug && typeof post.slug === 'string')
        .map((post) => ({
          slug: post.slug,
        }));
    }
  } catch (error) {
    console.error('Error generating static params for news posts:', error);
  }
  
  return [];
}

export default async function NewsDetailPageRoute({ 
  params, 
  searchParams 
}: NewsDetailPageProps) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const currentLang = lang || 'vn';

  try {
    const response = await newsService.getNewsBySlug(slug, currentLang);
    
    if (!response.success || !response.data) {
      notFound();
    }

    const post = response.data;

    return <NewsDetailPage post={post} />;
  } catch (error) {
    console.error('Error fetching news post:', error);
    notFound();
  }
}