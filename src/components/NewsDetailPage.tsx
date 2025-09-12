'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Tag, 
  Share2, 
  User,
  Eye,
  TrendingUp,
  Building,
  Globe,
  FileText,
  Award
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { NewsArticle, newsService } from '@/services/newsService';
import { formatNewsContent, sanitizeHtml } from '@/utils/contentFormatter';
import Image from "next/image";

interface NewsDetailPageProps {
  post: NewsArticle;
}

export default function NewsDetailPage({ post }: NewsDetailPageProps) {
  const { t, currentLocale } = useTranslation();
  const [relatedPosts, setRelatedPosts] = useState<NewsArticle[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);

  // Fetch related posts
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const response = await newsService.getRelatedNews(
          post.id,
          post.category,
          currentLocale,
          3
        );
        if (response.success && response.data) {
          setRelatedPosts(response.data);
        }
      } catch (error) {
        console.error('Error fetching related posts:', error);
      }
    };

    if (post.id) {
      fetchRelatedPosts();
    }
  }, [post.id, post.category, currentLocale]);

  // Reading progress tracking
  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.pageYOffset;
      setReadingProgress((current / scrollTotal) * 100);
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  // Get reading time
  const getReadingTime = () => {
    if (post.read_time) return parseInt(post.read_time.replace(/[^\d]/g, ''));
    const wordsPerMinute = 200;
    const wordCount = post.content?.split(' ').length || 0;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Get category icon
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'company-news': 
        return <Building className="w-4 h-4" />;
      case 'industry-news': 
        return <TrendingUp className="w-4 h-4" />;
      case 'new-regulations': 
        return <Globe className="w-4 h-4" />;
      case 'events': 
        return <Award className="w-4 h-4" />;
      default: 
        return <FileText className="w-4 h-4" />;
    }
  };

  // Share functionality
  const handleShare = async () => {
    const url = window.location.href;
    const title = post.title;
    
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      // Could add toast notification here
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLocale === 'vn' ? 'vi-VN' : currentLocale === 'cn' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div 
          className="h-1 bg-primary transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container mx-auto px-6">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <Link
                href="/news"
                className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>{t('news.backToNews')}</span>
              </Link>
            </motion.div>

            {/* Article Header */}
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                {/* Category Badge */}
                {post.category && (
                  <div className="mb-4">
                    <Link
                      href={`/news?category=${post.category}`}
                      className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                    >
                      {getCategoryIcon(post.category)}
                      <span>{post.category}</span>
                    </Link>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{getReadingTime()} {t('news.minuteRead')}</span>
                  </div>

                  {post.views && (
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>{post.views} {t('news.views')}</span>
                    </div>
                  )}

                  {/* Share Button */}
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-3 py-1 hover:bg-accent rounded-full transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{t('news.share')}</span>
                  </button>
                </div>
              </motion.div>

              {/* Featured Image */}
              {post.image_url && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                  />
                </motion.div>
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-muted-foreground mb-8 p-6 bg-accent/50 rounded-lg border-l-4 border-primary"
                >
                  {post.excerpt}
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="prose prose-lg max-w-none"
                style={{
                  '--tw-prose-body': 'var(--foreground)',
                  '--tw-prose-headings': 'var(--foreground)',
                  '--tw-prose-links': 'var(--primary)',
                  '--tw-prose-bold': 'var(--foreground)',
                  '--tw-prose-counters': 'var(--muted-foreground)',
                  '--tw-prose-bullets': 'var(--muted-foreground)',
                  '--tw-prose-hr': 'var(--border)',
                  '--tw-prose-quotes': 'var(--muted-foreground)',
                  '--tw-prose-quote-borders': 'var(--border)',
                  '--tw-prose-captions': 'var(--muted-foreground)',
                  '--tw-prose-code': 'var(--foreground)',
                  '--tw-prose-pre-code': 'var(--foreground)',
                  '--tw-prose-pre-bg': 'var(--muted)',
                  '--tw-prose-th-borders': 'var(--border)',
                  '--tw-prose-td-borders': 'var(--border)',
                } as React.CSSProperties}
              >
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: sanitizeHtml(formatNewsContent(post.content))
                  }} 
                />
              </motion.article>

              {/* Article Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between py-8 border-t border-b border-border mt-12 mb-8"
              >
                <div className="flex items-center space-x-4">
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4" />
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>{t('news.share')}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="py-12 bg-accent/30">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold mb-8"
                >
                  {t('news.relatedArticles')}
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost, index) => (
                    <motion.div
                      key={relatedPost.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Link
                        href={`/news/${relatedPost.slug || relatedPost.id}`}
                        className="block group"
                      >
                        <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border group-hover:border-primary/50 h-full">
                          {relatedPost.image_url && (
                            <Image
                              src={relatedPost.image_url}
                              alt={relatedPost.title}
                              className="w-full h-32 object-cover rounded-lg mb-4"
                            />
                          )}
                          
                          <div className="space-y-2">
                            {relatedPost.category && (
                              <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                {relatedPost.category}
                              </span>
                            )}
                            
                            <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h3>
                            
                            {relatedPost.excerpt && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {relatedPost.excerpt}
                              </p>
                            )}
                            
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground pt-2">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(relatedPost.created_at)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>5 {t('news.minuteRead')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center mt-8"
                >
                  <Link
                    href="/news"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                    <span>{t('news.viewAllArticles')}</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}