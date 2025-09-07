'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../contexts/LanguageContext';
import Link from 'next/link';
import LanguageSwitcher from './shared/LanguageSwitcher';
import { 
  Truck, 
  Menu, 
  X,
  Search,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Eye,
  Tag,
  TrendingUp,
  Building,
  Globe,
  FileText,
  Award
} from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  views: number;
  featured: boolean;
  image: string;
  tags: string[];
}

export default function NewsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();

  const articlesPerPage = 9;

  // Mock news data
  const newsArticles: NewsArticle[] = [
    {
      id: '1',
      title: t('news.articles.expansion.title'),
      excerpt: t('news.articles.expansion.excerpt'),
      content: t('news.articles.expansion.content'),
      category: t('news.categories.company'),
      author: 'Nguyễn Đình Sơn',
      publishedAt: '2024-12-01',
      readTime: '5 phút',
      views: 1250,
      featured: true,
      image: '/api/placeholder/400/250',
      tags: [t('news.tags.expansion'), t('news.tags.business')]
    },
    {
      id: '2',
      title: t('news.articles.partnership.title'),
      excerpt: t('news.articles.partnership.excerpt'),
      content: t('news.articles.partnership.content'),
      category: t('news.categories.company'),
      author: 'Trần Minh Hưng',
      publishedAt: '2024-11-28',
      readTime: '4 phút',
      views: 980,
      featured: true,
      image: '/api/placeholder/400/250',
      tags: [t('news.tags.partnership'), t('news.tags.logistics')]
    },
    {
      id: '3',
      title: t('news.articles.technology.title'),
      excerpt: t('news.articles.technology.excerpt'),
      content: t('news.articles.technology.content'),
      category: t('news.categories.industry'),
      author: 'Lê Thị Mai',
      publishedAt: '2024-11-25',
      readTime: '6 phút',
      views: 750,
      featured: false,
      image: '/api/placeholder/400/250',
      tags: [t('news.tags.technology'), t('news.tags.innovation')]
    },
    {
      id: '4',
      title: t('news.articles.regulations.title'),
      excerpt: t('news.articles.regulations.excerpt'),
      content: t('news.articles.regulations.content'),
      category: t('news.categories.regulations'),
      author: 'Phạm Văn Đức',
      publishedAt: '2024-11-22',
      readTime: '7 phút',
      views: 620,
      featured: false,
      image: '/api/placeholder/400/250',
      tags: [t('news.tags.regulations'), t('news.tags.trade')]
    },
    {
      id: '5',
      title: t('news.articles.awards.title'),
      excerpt: t('news.articles.awards.excerpt'),
      content: t('news.articles.awards.content'),
      category: t('news.categories.events'),
      author: 'Vũ Thành Long',
      publishedAt: '2024-11-20',
      readTime: '3 phút',
      views: 1100,
      featured: true,
      image: '/api/placeholder/400/250',
      tags: [t('news.tags.awards'), t('news.tags.recognition')]
    },
    {
      id: '6',
      title: t('news.articles.market_analysis.title'),
      excerpt: t('news.articles.market_analysis.excerpt'),
      content: t('news.articles.market_analysis.content'),
      category: t('news.categories.industry'),
      author: 'Hoàng Minh Tuyền',
      publishedAt: '2024-11-18',
      readTime: '8 phút',
      views: 890,
      featured: false,
      image: '/api/placeholder/400/250',
      tags: [t('news.tags.market'), t('news.tags.analysis')]
    }
  ];

  const categories = [
    { id: 'all', name: t('news.categories.all'), icon: FileText },
    { id: 'company', name: t('news.categories.company'), icon: Building },
    { id: 'industry', name: t('news.categories.industry'), icon: TrendingUp },
    { id: 'regulations', name: t('news.categories.regulations'), icon: Globe },
    { id: 'events', name: t('news.categories.events'), icon: Award }
  ];

  // Filter and search articles
  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === categories.find(c => c.id === selectedCategory)?.name;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  const featuredArticles = filteredArticles.filter(article => article.featured).slice(0, 3);
  const regularArticles = paginatedArticles.filter(article => !article.featured || !featuredArticles.includes(article));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-blue-900 to-green-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-6 relative z-10">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {t('news.hero.title')}
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                {t('news.hero.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Categories */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              {/* Search Bar */}
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('news.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <motion.button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setCurrentPage(1);
                      }}
                      className={`flex items-center px-6 py-3 rounded-full font-medium transition-all ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {category.name}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && selectedCategory === 'all' && !searchTerm && (
          <section className="py-16">
            <div className="container mx-auto px-6">
              <motion.h2
                className="text-3xl font-bold text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {t('news.featured.title')}
              </motion.h2>

              <div className="grid lg:grid-cols-3 gap-8">
                {featuredArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative overflow-hidden">
                      <div
                        className="w-full h-48 group-hover:scale-105 transition-transform duration-300"
                        style={{
                          backgroundImage: `url(${article.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                        role="img"
                        aria-label={article.title}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {t('news.featured.badge')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <Tag className="w-4 h-4 mr-1" />
                          {article.category}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(article.publishedAt)}
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {article.views}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-500">{article.author}</span>
                        </div>
                        <span className="text-sm text-gray-500">{article.readTime}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Regular Articles Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">
                {selectedCategory === 'all' ? t('news.latest.title') : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <span className="text-gray-500">
                {t('news.results', { count: filteredArticles.length })}
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {regularArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative overflow-hidden">
                    <div
                      className="w-full h-48 group-hover:scale-105 transition-transform duration-300"
                      style={{
                        backgroundImage: `url(${article.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                      role="img"
                      aria-label={article.title}
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <Tag className="w-4 h-4 mr-1" />
                        {article.category}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-500">{article.author}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center text-sm text-gray-500">
                          <Eye className="w-4 h-4 mr-1" />
                          {article.views}
                        </span>
                        <span className="text-sm text-gray-500">{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                className="flex justify-center items-center gap-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {t('news.pagination.previous')}
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('news.pagination.next')}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="py-20 bg-gradient-to-r from-blue-900 to-green-800 text-white">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                {t('news.newsletter.title')}
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                {t('news.newsletter.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={t('news.newsletter.placeholder')}
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
                />
                <motion.button
                  className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('news.newsletter.subscribe')}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}