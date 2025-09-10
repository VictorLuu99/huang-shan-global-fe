import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import KnowledgeDetailPage from '@/components/KnowledgeDetailPage';
import { knowledgeService } from '@/services/knowledgeService';

// Static generation for better performance
// export const dynamic = 'force-dynamic';

interface KnowledgeDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params
}: KnowledgeDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const currentLang = 'vn'; // Default to Vietnamese for static generation

  try {
    const response = await knowledgeService.getKnowledgeBySlug(slug, currentLang);
    
    if (!response.success || !response.data) {
      return {
        title: 'Knowledge Article Not Found - Huang Shan Global',
        description: 'The requested knowledge article could not be found.',
      };
    }

    const post = response.data;
    const title = post.title || post.title_vn || post.title_en || post.title_cn || 'Knowledge Article';
    const description = post.excerpt || `Learn about ${title} with Huang Shan Global's comprehensive logistics knowledge base.`;

    return {
      title: `${title} - Huang Shan Global Knowledge`,
      description: description,
      keywords: [
        'logistics knowledge',
        'China Vietnam logistics',
        'import export guide',
        'shipping procedures',
        'customs regulations',
        post.category || 'logistics',
        title.toLowerCase()
      ],
      openGraph: {
        title: `${title} - Huang Shan Global`,
        description: description,
        type: 'article',
        url: `https://huang-shan-global-fe.pages.dev/knowledge/${slug}`,
        images: post.featured_image ? [
          {
            url: post.featured_image,
            width: 1200,
            height: 630,
            alt: title,
          }
        ] : [
          {
            url: '/images/og-default.jpg',
            width: 1200,
            height: 630,
            alt: 'Huang Shan Global Knowledge',
          }
        ],
        publishedTime: post.created_at,
        modifiedTime: post.updated_at,
        section: post.category || 'Logistics',
        tags: [post.category || 'logistics', 'China', 'Vietnam', 'shipping'],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} - Huang Shan Global`,
        description: description,
        images: post.featured_image ? [post.featured_image] : ['/images/og-default.jpg'],
      },
      alternates: {
        canonical: `https://huang-shan-global-fe.pages.dev/knowledge/${slug}`,
        languages: {
          'vi': `/knowledge/${slug}?lang=vn`,
          'zh': `/knowledge/${slug}?lang=cn`,
          'en': `/knowledge/${slug}?lang=en`,
        },
      },
      other: {
        'article:author': 'Huang Shan Global',
        'article:section': post.category || 'Logistics',
        'article:tag': [post.category || 'logistics', 'shipping', 'import-export'].join(','),
      },
    };
  } catch (error) {
    console.error('Error generating metadata for knowledge post:', error);
    
    return {
      title: 'Knowledge Article - Huang Shan Global',
      description: 'Learn about logistics processes and procedures with Huang Shan Global.',
    };
  }
}

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    // Fetch all knowledge posts to pre-generate slug-based routes
    const response = await knowledgeService.getKnowledge({ limit: 100 });
    
    if (response.success && response.data) {
      // Only return posts that have slugs (filter out null/undefined slugs)
      return response.data
        .filter((post) => post.slug && typeof post.slug === 'string')
        .map((post) => ({
          slug: post.slug,
        }));
    }
  } catch (error) {
    console.error('Error generating static params for knowledge posts:', error);
  }
  
  return [];
}

export default async function KnowledgeDetailPageRoute({ 
  params
}: KnowledgeDetailPageProps) {
  const { slug } = await params;
  const currentLang = 'vn'; // Default to Vietnamese for static generation

  try {
    const response = await knowledgeService.getKnowledgeBySlug(slug, currentLang);
    
    if (!response.success || !response.data) {
      notFound();
    }

    const post = response.data;

    return <KnowledgeDetailPage post={post} />;
  } catch (error) {
    console.error('Error fetching knowledge post:', error);
    notFound();
  }
}
// export const runtime = 'edge';