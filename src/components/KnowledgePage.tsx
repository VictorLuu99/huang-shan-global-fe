'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { 
  Truck, 
  Menu, 
  X,
  BookOpen,
  Search,
  Download,
  Eye,
  Clock,
  Tag,
  Star,
  FileText,
  Users,
  TrendingUp,
  Shield
} from 'lucide-react';

interface KnowledgeGuide {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  downloads: number;
  rating: number;
  image: string;
  featured: boolean;
  tags: string[];
  type: 'guide' | 'template' | 'checklist';
}

const KnowledgePage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const t = useTranslations();

  // Mock knowledge guides data
  const knowledgeGuides: KnowledgeGuide[] = [
    {
      id: '1',
      title: t('knowledge.guides.customs_procedures.title'),
      description: t('knowledge.guides.customs_procedures.description'),
      category: 'procedures',
      difficulty: 'beginner',
      readingTime: 15,
      downloads: 1250,
      rating: 4.8,
      image: '/images/customs-guide.jpg',
      featured: true,
      tags: ['customs', 'procedures', 'beginner'],
      type: 'guide'
    },
    {
      id: '2',
      title: t('knowledge.guides.import_export_documents.title'),
      description: t('knowledge.guides.import_export_documents.description'),
      category: 'regulations',
      difficulty: 'intermediate',
      readingTime: 25,
      downloads: 980,
      rating: 4.9,
      image: '/images/documents-guide.jpg',
      featured: true,
      tags: ['documents', 'regulations', 'import-export'],
      type: 'template'
    },
    {
      id: '3',
      title: t('knowledge.guides.tax_calculation.title'),
      description: t('knowledge.guides.tax_calculation.description'),
      category: 'taxes',
      difficulty: 'advanced',
      readingTime: 20,
      downloads: 750,
      rating: 4.7,
      image: '/images/tax-guide.jpg',
      featured: false,
      tags: ['taxes', 'calculation', 'advanced'],
      type: 'checklist'
    },
    {
      id: '4',
      title: t('knowledge.guides.shipping_insurance.title'),
      description: t('knowledge.guides.shipping_insurance.description'),
      category: 'tips',
      difficulty: 'intermediate',
      readingTime: 18,
      downloads: 890,
      rating: 4.6,
      image: '/images/insurance-guide.jpg',
      featured: false,
      tags: ['insurance', 'shipping', 'protection'],
      type: 'guide'
    },
    {
      id: '5',
      title: t('knowledge.guides.warehouse_management.title'),
      description: t('knowledge.guides.warehouse_management.description'),
      category: 'guides',
      difficulty: 'intermediate',
      readingTime: 30,
      downloads: 1100,
      rating: 4.8,
      image: '/images/warehouse-guide.jpg',
      featured: true,
      tags: ['warehouse', 'management', 'logistics'],
      type: 'guide'
    },
    {
      id: '6',
      title: t('knowledge.guides.quality_control.title'),
      description: t('knowledge.guides.quality_control.description'),
      category: 'customs',
      difficulty: 'advanced',
      readingTime: 22,
      downloads: 650,
      rating: 4.9,
      image: '/images/quality-guide.jpg',
      featured: false,
      tags: ['quality', 'control', 'inspection'],
      type: 'checklist'
    }
  ];

  const categories = [
    { id: 'all', label: t('knowledge.categories.all'), count: knowledgeGuides.length },
    { id: 'procedures', label: t('knowledge.categories.procedures'), count: knowledgeGuides.filter(g => g.category === 'procedures').length },
    { id: 'regulations', label: t('knowledge.categories.regulations'), count: knowledgeGuides.filter(g => g.category === 'regulations').length },
    { id: 'customs', label: t('knowledge.categories.customs'), count: knowledgeGuides.filter(g => g.category === 'customs').length },
    { id: 'taxes', label: t('knowledge.categories.taxes'), count: knowledgeGuides.filter(g => g.category === 'taxes').length },
    { id: 'guides', label: t('knowledge.categories.guides'), count: knowledgeGuides.filter(g => g.category === 'guides').length },
    { id: 'tips', label: t('knowledge.categories.tips'), count: knowledgeGuides.filter(g => g.category === 'tips').length }
  ];

  const filteredGuides = knowledgeGuides.filter(guide => {
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredGuides = knowledgeGuides.filter(guide => guide.featured);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <BookOpen className="w-4 h-4" />;
      case 'template': return <FileText className="w-4 h-4" />;
      case 'checklist': return <Shield className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary">Huang Shan Global</span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.home')}</Link>
              <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.about')}</Link>
              <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.services')}</Link>
              <Link href="/policies" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.policies')}</Link>
              <Link href="/recruitment" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.recruitment')}</Link>
              <Link href="/news" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.news')}</Link>
              <Link href="/knowledge" className="text-sm font-medium text-primary">{t('nav.complaints')}</Link>
              <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.contact')}</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background border-t border-border"
            >
              <div className="container mx-auto px-4 py-4">
                <nav className="flex flex-col space-y-4">
                  <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.home')}</Link>
                  <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.about')}</Link>
                  <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.services')}</Link>
                  <Link href="/policies" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.policies')}</Link>
                  <Link href="/recruitment" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.recruitment')}</Link>
                  <Link href="/news" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.news')}</Link>
                  <Link href="/knowledge" className="text-sm font-medium text-primary">{t('nav.complaints')}</Link>
                  <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.contact')}</Link>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('knowledge.title')}
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                {t('knowledge.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Categories */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-6">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('knowledge.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </motion.div>

            {/* Category Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Guides */}
        {featuredGuides.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold mb-4">{t('knowledge.featured.title')}</h2>
                <p className="text-muted-foreground">{t('knowledge.featured.subtitle')}</p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredGuides.map((guide, index) => (
                  <motion.div
                    key={guide.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getTypeIcon(guide.type)}
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                          {t('knowledge.featured')}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center space-x-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium">{guide.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(guide.difficulty)}`}>
                          {t(`knowledge.difficulty.${guide.difficulty}`)}
                        </span>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{guide.readingTime} {t('knowledge.readingTime')}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {guide.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {guide.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Download className="w-4 h-4" />
                            <span>{guide.downloads}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors flex items-center space-x-2">
                            <Eye className="w-4 h-4" />
                            <span>{t('knowledge.viewGuide')}</span>
                          </button>
                          <button className="px-3 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Guides */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">{t('knowledge.allGuides.title')}</h2>
              <p className="text-muted-foreground">
                {t('knowledge.search.results', { count: filteredGuides.length })}
              </p>
            </motion.div>

            {filteredGuides.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('knowledge.search.noResults')}</h3>
                <p className="text-muted-foreground">{t('knowledge.search.tryDifferent')}</p>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuides.map((guide, index) => (
                  <motion.div
                    key={guide.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="group bg-background border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-muted/50 to-muted/80 flex items-center justify-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getTypeIcon(guide.type)}
                      </div>
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center space-x-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium">{guide.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(guide.difficulty)}`}>
                          {t(`knowledge.difficulty.${guide.difficulty}`)}
                        </span>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{guide.readingTime} {t('knowledge.readingTime')}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {guide.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {guide.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Download className="w-4 h-4" />
                          <span>{guide.downloads}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/80 transition-colors flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{t('knowledge.viewGuide')}</span>
                          </button>
                          <button className="px-2 py-1.5 bg-muted text-muted-foreground text-sm rounded-lg hover:bg-muted/80 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Statistics */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">{t('knowledge.stats.title')}</h2>
              <p className="text-muted-foreground">{t('knowledge.stats.subtitle')}</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2">50+</h3>
                <p className="text-muted-foreground">{t('knowledge.stats.guidesPublished')}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2">10K+</h3>
                <p className="text-muted-foreground">{t('knowledge.stats.usersHelped')}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2">95%</h3>
                <p className="text-muted-foreground">{t('knowledge.stats.successRate')}</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default KnowledgePage;