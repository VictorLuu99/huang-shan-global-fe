import { apiClient, ApiResponse, SearchParams } from './api';

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  published_at: string;
  read_time?: string;
  views?: number;
  featured: boolean;
  image_url?: string;
  tags?: string[];
  slug?: string;
}

export interface NewsListResponse {
  data: NewsArticle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export class NewsService {
  /**
   * Fetch paginated news articles with optional filtering
   */
  static async getNews(params: SearchParams = {}): Promise<ApiResponse<NewsArticle[]>> {
    const queryParams: Record<string, string | number> = {};
    
    if (params.lang) queryParams.lang = params.lang;
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.category && params.category !== 'all') queryParams.category = params.category;
    if (params.search) queryParams.search = params.search;

    return await apiClient.get<NewsArticle[]>('/api/news', queryParams);
  }

  /**
   * Fetch a single news article by ID
   */
  static async getNewsById(id: string, lang?: string): Promise<ApiResponse<NewsArticle>> {
    const params: Record<string, string> = {};
    if (lang) params.lang = lang;
    
    return await apiClient.get<NewsArticle>(`/api/news/${id}`, params);
  }

  /**
   * Fetch featured news articles
   */
  static async getFeaturedNews(lang?: string, limit = 3): Promise<ApiResponse<NewsArticle[]>> {
    const params: Record<string, string | number> = {
      featured: 'true',
      limit
    };
    if (lang) params.lang = lang;
    
    return await apiClient.get<NewsArticle[]>('/api/news', params);
  }

  /**
   * Fetch news articles by category
   */
  static async getNewsByCategory(
    category: string, 
    params: SearchParams = {}
  ): Promise<ApiResponse<NewsArticle[]>> {
    return await this.getNews({
      ...params,
      category
    });
  }

  /**
   * Search news articles
   */
  static async searchNews(
    searchTerm: string, 
    params: SearchParams = {}
  ): Promise<ApiResponse<NewsArticle[]>> {
    return await this.getNews({
      ...params,
      search: searchTerm
    });
  }

  /**
   * Fetch news categories
   */
  static async getCategories(lang?: string): Promise<ApiResponse<Category[]>> {
    const params: Record<string, string> = {};
    if (lang) params.lang = lang;
    
    return await apiClient.get<Category[]>('/api/news/categories', params);
  }
}

// Export default instance
export const newsService = NewsService;