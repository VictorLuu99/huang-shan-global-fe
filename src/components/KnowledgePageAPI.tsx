"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "../contexts/LanguageContext";
import {
  knowledgeService,
  KnowledgePost,
  Category,
} from "../services/knowledgeService";
import { handleApiError } from "../services/api";
import {
  BookOpen,
  Search,
  Eye,
  Clock,
  Tag,
  Star,
  FileText,
  Users,
  TrendingUp,
  Shield,
  Loader2,
} from "lucide-react";

const KnowledgePageAPI: React.FC = () => {
  // Initialize selectedCategory from URL parameter
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("category") || "all";
    }
    return "all";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [guides, setGuides] = useState<KnowledgePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const { t, currentLocale } = useTranslation();

  const itemsPerPage = 12;

  // URL parameter for category is handled by initial state

  // Update URL when category changes
  useEffect(() => {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);
    const currentUrlCategory = urlParams.get("category");

    // Only update URL if the category has actually changed
    if (currentUrlCategory !== selectedCategory) {
      if (selectedCategory === "all") {
        // Remove category parameter from URL
        urlParams.delete("category");
      } else {
        // Add category parameter to URL
        urlParams.set("category", selectedCategory);
      }

      // Update URL without page reload
      const newUrl = `${url.pathname}${
        urlParams.toString() ? "?" + urlParams.toString() : ""
      }`;
      window.history.replaceState({}, "", newUrl);
    }
  }, [selectedCategory]);

  // Fetch knowledge guides from API
  useEffect(() => {
    const abortController = new AbortController();
    let isCancelled = false;
    
    const fetchGuides = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = (await knowledgeService.getKnowledge({
          lang: currentLocale,
          page: currentPage,
          limit: itemsPerPage,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          search: searchQuery || undefined,
        })) as unknown as {
          data: KnowledgePost[];
          pagination: {
            limit: number;
            page: number;
            pages: number;
            total: number;
          };
          success: boolean;
          error: string | null;
        };

        // Only update state if this request hasn't been cancelled
        if (!isCancelled && !abortController.signal.aborted) {
          if (response.success && response.data) {
            setGuides(response.data);
            setTotalResults(response.pagination.total || 0);
          } else {
            throw new Error(response.error || "Failed to fetch knowledge guides");
          }
        }
      } catch (err) {
        // Only update error state if this request hasn't been cancelled and it's not an abort error
        if (!isCancelled && !abortController.signal.aborted && (err as Error).name !== 'AbortError') {
          setError(handleApiError(err));
          setGuides([]);
        }
      } finally {
        // Only update loading state if this request hasn't been cancelled
        if (!isCancelled && !abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchGuides();

    // Cleanup function to cancel the request if component unmounts or dependencies change
    return () => {
      isCancelled = true;
      abortController.abort();
    };
  }, [currentLocale, currentPage, selectedCategory, searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await knowledgeService.getCategories(currentLocale);

        if (Array.isArray(response)) {
          // Add "all" category at the beginning with count
          const allCategories = [
            { id: "all", name: t("knowledge.categories.all"), slug: "all" },
            ...response.map((cat) => ({ ...cat })),
          ];
          setCategories(allCategories);
        } else {
          throw new Error(response.error || "Failed to fetch categories");
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([
          { id: "all", name: t("knowledge.categories.all"), slug: "all" },
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [currentLocale]);

  const featuredGuides = guides.slice(0, 3); // Show first 3 guides as featured

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-600 bg-green-100";
      case "intermediate":
        return "text-yellow-600 bg-yellow-100";
      case "advanced":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "guide":
        return <BookOpen className="w-4 h-4" />;
      case "template":
        return <FileText className="w-4 h-4" />;
      case "checklist":
        return <Shield className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getReadingTime = (guide: KnowledgePost) => {
    if (guide.read_time) return parseInt(guide.read_time.replace(" phút", ""));
    // Estimate reading time based on content length
    const wordsPerMinute = 200;
    const wordCount = guide?.content?.split(" ").length || 0;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const getRating = () => {
    return 4.5 + Math.random() * 0.5;
  };

  const getDifficulty = () => {
    return ["beginner", "intermediate", "advanced"][
      Math.floor(Math.random() * 3)
    ] as "beginner" | "intermediate" | "advanced";
  };

  const getType = () => {
    return ["guide", "template", "checklist"][Math.floor(Math.random() * 3)] as
      | "guide"
      | "template"
      | "checklist";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
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
                {t("knowledge.title")}
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                {t("knowledge.subtitle")}
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
                  placeholder={t("knowledge.search.placeholder")}
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
              {categoriesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">
                    Loading categories...
                  </span>
                </div>
              ) : (
                categories.map((category) => {
                  const categorySlug = category.slug || category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(categorySlug)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        selectedCategory === categorySlug
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {category.name} {category.id === "all"}
                    </button>
                  );
                })
              )}
            </motion.div>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <section className="py-16">
            <div className="container mx-auto px-6">
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600">Đang tải kiến thức...</p>
              </div>
            </div>
          </section>
        )}

        {/* Error State */}
        {error && (
          <section className="py-16">
            <div className="container mx-auto px-6">
              <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Featured Guides */}
        {!loading && !error && featuredGuides.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold mb-4">
                  {t("knowledge.featuredSection.title")}
                </h2>
                <p className="text-muted-foreground">
                  {t("knowledge.featuredSection.subtitle")}
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredGuides.slice(0, 3).map((guide, index) => (
                  <motion.div
                    key={guide.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link
                      href={`/knowledge/${guide.slug}`}
                      className="block group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                          {getTypeIcon(getType())}
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                            {t("knowledge.featured")}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center space-x-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs font-medium">
                              {getRating().toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                              getDifficulty()
                            )}`}
                          >
                            {t(`knowledge.difficulty.${getDifficulty()}`)}
                          </span>
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">
                              {getReadingTime(guide)}{" "}
                              {t("knowledge.readingTime")}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {guide.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {guide.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {guide.tags?.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </span>
                          )) ||
                            // Default tags if none provided
                            [guide.category, getType(), getDifficulty()]
                              .slice(0, 3)
                              .map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                                >
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </span>
                              ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              {/* <Download className="w-4 h-4" />
                            <span>{getDownloads()}</span> */}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2">
                              <Eye className="w-4 h-4" />
                              <span>{t("knowledge.viewGuide")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Guides */}
        {!loading && !error && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold mb-4">
                  {t("knowledge.allGuides.title")}
                </h2>
                <p className="text-muted-foreground">
                  {`${t("knowledge.search.results", { count: guides.length })}`}
                </p>
              </motion.div>

              {guides.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {t("knowledge.search.noResults")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("knowledge.search.tryDifferent")}
                  </p>
                </motion.div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guides.map((guide, index) => (
                    <motion.div
                      key={guide.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <Link
                        href={`/knowledge/${guide.slug}`}
                        className="block group bg-background border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20"
                      >
                        <div className="relative h-40 bg-gradient-to-br from-muted/50 to-muted/80 flex items-center justify-center">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            {getTypeIcon(getType())}
                          </div>
                          <div className="absolute top-3 right-3">
                            <div className="flex items-center space-x-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs font-medium">
                                {getRating().toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                                getDifficulty()
                              )}`}
                            >
                              {t(`knowledge.difficulty.${getDifficulty()}`)}
                            </span>
                            <div className="flex items-center space-x-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">
                                {getReadingTime(guide)}{" "}
                                {t("knowledge.readingTime")}
                              </span>
                            </div>
                          </div>
                          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {guide.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {guide.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              {/* <Download className="w-4 h-4" /> */}
                              {/* <span>{getDownloads()}</span> */}
                            </div>
                            <div className="flex space-x-2">
                              <div className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span>{t("knowledge.viewGuide")}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Statistics */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                {t("knowledge.stats.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("knowledge.stats.subtitle")}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2">
                  {totalResults || "50+"}+
                </h3>
                <p className="text-muted-foreground">
                  {t("knowledge.stats.guidesPublished")}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2">10K+</h3>
                <p className="text-muted-foreground">
                  {t("knowledge.stats.usersHelped")}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2">95%</h3>
                <p className="text-muted-foreground">
                  {t("knowledge.stats.successRate")}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default KnowledgePageAPI;
