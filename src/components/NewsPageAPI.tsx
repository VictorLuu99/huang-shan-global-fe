"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "../contexts/LanguageContext";
import { newsService, NewsArticle, Category } from "../services/newsService";
import { handleApiError } from "../services/api";
import {
  Search,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Tag,
  TrendingUp,
  Building,
  Globe,
  FileText,
  Award,
  Loader2,
} from "lucide-react";

export default function NewsPageAPI() {
  // Initialize selectedCategory from URL parameter
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("category") || "all";
    }
    return "all";
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const { t, currentLocale } = useTranslation();


  // Handle URL parameters for category filtering is already done in initial state

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

  // Fetch articles from API
  useEffect(() => {
    const abortController = new AbortController();
    let isCancelled = false;
    
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = (await newsService.getNews({
          lang: currentLocale,
          page: currentPage,
          limit: 9,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          search: searchTerm || undefined,
        })) as unknown as {
          success: boolean;
          data: NewsArticle[];
          pagination: {
            limit: number;
            page: number;
            pages: number;
            total: number;
          };
          error?: string;
        };

        // Only update state if this request hasn't been cancelled
        if (!isCancelled && !abortController.signal.aborted) {
          if (response.success && response.data) {
            setArticles(response.data);
            setTotalPages(response.pagination.pages || 1);
            setTotalResults(response.pagination.total || 0);
          } else {
            throw new Error(response.error || "Failed to fetch articles");
          }
        } 
      } catch (err) {
        // Only update error state if this request hasn't been cancelled and it's not an abort error
        if (!isCancelled && !abortController.signal.aborted && (err as Error).name !== 'AbortError') {
          setError(handleApiError(err));
          setArticles([]);
        }
      } finally {
        // Only update loading state if this request hasn't been cancelled
        if (!isCancelled && !abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchArticles();

    // Cleanup function to cancel the request if component unmounts or dependencies change
    return () => {
      isCancelled = true;
      abortController.abort();
    };
  }, [currentLocale, currentPage, selectedCategory, searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await newsService.getCategories(currentLocale);
        if (Array.isArray(response)) {
          // Add "all" category at the beginning
          const allCategories = [
            { id: "all", name: t("news.categories.all"), slug: "all" },
            ...response.map((cat) => ({ ...cat })),
          ];
          setCategories(allCategories);
        } else {
          throw new Error(response.error || "Failed to fetch categories");
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        // Fallback to empty categories if API fails
        setCategories([
          { id: "all", name: t("news.categories.all"), slug: "all" },
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [currentLocale]);

  // Map categories to include icons (keeping icon mapping for UI)
  const getCategoryIcon = (slug: string) => {
    const iconMap: Record<
      string,
      React.ComponentType<{ className?: string }>
    > = {
      all: FileText,
      "company-news": Building,
      "industry-news": TrendingUp,
      "new-regulations": Globe,
      events: Award,
    };
    return iconMap[slug] || FileText;
  };

  // Get news type icon for fallback display when image is undefined
  const getNewsTypeIcon = (category?: string) => {
    switch (category) {
      case "company-news":
        return <Building className="w-8 h-8 text-primary" />;
      case "industry-news":
        return <TrendingUp className="w-8 h-8 text-primary" />;
      case "new-regulations":
        return <Globe className="w-8 h-8 text-primary" />;
      case "events":
        return <Award className="w-8 h-8 text-primary" />;
      default:
        return <FileText className="w-8 h-8 text-primary" />;
    }
  };

  const featuredArticles = articles
    .filter((article) => article.featured)
    .slice(0, 3);
  const regularArticles = articles.filter((article) => !article.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadTime = (article: NewsArticle) => {
    if (article.read_time) return article.read_time;
    // Estimate reading time based on content length
    const wordsPerMinute = 200;
    const wordCount = article?.content ? article?.content.split(" ").length : 0;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} phút`;
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
                {t("news.hero.title")}
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                {t("news.hero.subtitle")}
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
                  placeholder={t("news.search.placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-3 justify-center">
                {categoriesLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">
                      Loading categories...
                    </span>
                  </div>
                ) : (
                  categories.map((category, index) => {
                    const IconComponent = getCategoryIcon(category.slug);
                    const categorySlug = category.slug || category.id;
                    return (
                      <motion.button
                        key={category.id}
                        onClick={() => setSelectedCategory(categorySlug)}
                        className={`flex items-center px-6 py-3 rounded-full font-medium transition-all ${
                          selectedCategory === categorySlug
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
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
                  })
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <section className="py-16">
            <div className="container mx-auto px-6">
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600">Đang tải tin tức...</p>
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

        {/* Featured Articles */}
        {!loading &&
          !error &&
          featuredArticles.length > 0 &&
          selectedCategory === "all" &&
          !searchTerm && (
            <section className="py-16">
              <div className="container mx-auto px-6">
                <motion.h2
                  className="text-3xl font-bold text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  {t("news.featured.title")}
                </motion.h2>

                <div className="grid lg:grid-cols-3 gap-8">
                  {featuredArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <Link
                        href={`/news/${article.slug || article.id}`}
                        className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group cursor-pointer h-full"
                      >
                        <div className="relative overflow-hidden">
                          {article.image_url ? (
                            <div
                              className="w-full h-48 group-hover:scale-105 transition-transform duration-300"
                              style={{
                                backgroundImage: `url(${article.image_url})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                              role="img"
                              aria-label={article.title}
                            />
                          ) : (
                            <div className="relative h-48 bg-gradient-to-br from-muted/50 to-muted/80 flex items-center justify-center">
                              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                                {getNewsTypeIcon(article.category)}
                              </div>
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              {t("news.featured.badge")}
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
                              {formatDate(article.created_at)}
                            </span>
                            {/* <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {getViews(article)}
                          </span> */}
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
                              <span className="text-sm text-gray-500">
                                {article.author}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {getReadTime(article)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

        {/* Regular Articles Grid */}
        {!loading && !error && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">
                  {selectedCategory === "all"
                    ? t("news.latest.title")
                    : categories.find((c) => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-gray-500">
                  {`${t("news.results", { count: totalResults })}`}
                </span>
              </div>

              {articles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    Không có bài viết nào được tìm thấy.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {regularArticles.map((article, index) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <Link
                          href={`/news/${article.slug || article.id}`}
                          className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group cursor-pointer h-full"
                        >
                          <div className="relative overflow-hidden">
                            {article.image_url ? (
                              <div
                                className="w-full h-48 group-hover:scale-105 transition-transform duration-300"
                                style={{
                                  backgroundImage: `url(${article.image_url})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }}
                                role="img"
                                aria-label={article.title}
                              />
                            ) : (
                              <div className="relative h-48 bg-gradient-to-br from-muted/50 to-muted/80 flex items-center justify-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                                  {getNewsTypeIcon(article.category)}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="p-6">
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <span className="flex items-center">
                                <Tag className="w-4 h-4 mr-1" />
                                {article.category}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(article.created_at)}
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
                                <span className="text-sm text-gray-500">
                                  {article.author}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                {/* <span className="flex items-center text-sm text-gray-500">
                                <Eye className="w-4 h-4 mr-1" />
                                {getViews(article)}
                              </span> */}
                                <span className="text-sm text-gray-500">
                                  {getReadTime(article)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
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
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        {t("news.pagination.previous")}
                      </button>

                      <div className="flex gap-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNumber;
                            if (totalPages <= 5) {
                              pageNumber = i + 1;
                            } else {
                              const start = Math.max(
                                1,
                                Math.min(currentPage - 2, totalPages - 4)
                              );
                              pageNumber = start + i;
                            }

                            return (
                              <button
                                key={pageNumber}
                                onClick={() => setCurrentPage(pageNumber)}
                                className={`px-3 py-2 rounded-lg ${
                                  currentPage === pageNumber
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          }
                        )}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t("news.pagination.next")}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </section>
        )}

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
                {t("news.newsletter.title")}
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                {t("news.newsletter.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={t("news.newsletter.placeholder")}
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
                />
                <motion.button
                  className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("news.newsletter.subscribe")}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
