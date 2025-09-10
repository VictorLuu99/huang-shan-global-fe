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
  BookOpen, 
  Star,
  Eye
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { KnowledgePost, knowledgeService } from '@/services/knowledgeService';
import { formatKnowledgeContent, sanitizeHtml } from '@/utils/contentFormatter';

interface KnowledgeDetailPageProps {
  post: KnowledgePost;
}

export default function KnowledgeDetailPage({ post }: KnowledgeDetailPageProps) {
  const { t, currentLocale } = useTranslation();
  const [relatedPosts, setRelatedPosts] = useState<KnowledgePost[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);

  // Fetch related posts
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const response = await knowledgeService.getRelatedKnowledge(
          post.slug,
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

    if (post.slug) {
      fetchRelatedPosts();
    }
  }, [post.slug, post.category, currentLocale]);

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

  // Generate breadcrumb

  // Get reading time
  const getReadingTime = () => {
    if (post.read_time) return parseInt(post.read_time.replace(' phút', ''));
    const wordsPerMinute = 200;
    const wordCount = post.content?.split(' ').length || 0;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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
            {/* Breadcrumb Navigation */}
            {/* <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 text-sm text-muted-foreground mb-6"
            >
              {breadcrumb.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <ChevronRight className="w-4 h-4" />}
                  {index === breadcrumb.length - 1 ? (
                    <span className="text-foreground font-medium">{item.label}</span>
                  ) : (
                    <Link 
                      href={item.href}
                      className="hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </motion.nav> */}

            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <Link
                href="/knowledge"
                className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>{t('knowledge.backToKnowledge')}</span>
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
                      href={`/knowledge?category=${post.category}`}
                      className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                    >
                      <Tag className="w-4 h-4" />
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
                    <Clock className="w-4 h-4" />
                    <span>{getReadingTime()} {t('knowledge.minuteRead')}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {post.created_at 
                        ? new Date(post.created_at).toLocaleDateString(currentLocale === 'vn' ? 'vi-VN' : currentLocale === 'cn' ? 'zh-CN' : 'en-US')
                        : 'Recent'
                      }
                    </span>
                  </div>

                  {/* <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>{Math.floor(Math.random() * 1000) + 100} {t('knowledge.views')}</span>
                  </div> */}

                  {/* Difficulty Badge */}
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getDifficultyColor('intermediate')}`}>
                    <Star className="w-4 h-4" />
                    <span>{t('knowledge.intermediate')}</span>
                  </div>

                  {/* Share Button */}
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-3 py-1 hover:bg-accent rounded-full transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{t('knowledge.share')}</span>
                  </button>
                </div>
              </motion.div>

              {/* Featured Image */}
              {post.featured_image && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <img
                    src={post.featured_image}
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
                    __html: sanitizeHtml(formatKnowledgeContent(post.content))
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
                  {/* <button className="flex items-center space-x-2 px-4 py-2 hover:bg-accent rounded-lg transition-colors">
                    <ThumbsUp className="w-5 h-5" />
                    <span>{t('knowledge.helpful')}</span>
                    <span className="text-sm text-muted-foreground">({Math.floor(Math.random() * 50) + 10})</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 hover:bg-accent rounded-lg transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{t('knowledge.discuss')}</span>
                  </button> */}
                </div>
                <div className="flex items-center space-x-4">
                  {/* <button className="flex items-center space-x-2 px-4 py-2 hover:bg-accent rounded-lg transition-colors">
                    <Download className="w-5 h-5" />
                    <span>{t('knowledge.download')}</span>
                  </button> */}
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>{t('knowledge.share')}</span>
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
                  {t('knowledge.relatedArticles')}
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost, index) => (
                    <motion.div
                      key={relatedPost.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Link
                        href={`/knowledge/${relatedPost.slug}`}
                        className="block group"
                      >
                        <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border group-hover:border-primary/50 h-full">
                          {relatedPost.featured_image && (
                            <img
                              src={relatedPost.featured_image}
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
                                <Clock className="w-3 h-3" />
                                <span>5 {t('knowledge.minuteRead')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{Math.floor(Math.random() * 500) + 50}</span>
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
                    href="/knowledge"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>{t('knowledge.viewAllArticles')}</span>
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