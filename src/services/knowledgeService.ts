import { apiClient, ApiResponse, SearchParams } from './api';

export interface KnowledgePost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author?: string;
  created_at?: string;
  updated_at?: string;
  read_time?: string;
  views?: number;
  difficulty?: string;
  image_url?: string;
  featured_image?: string;
  tags?: string[];
  status?: string;
  featured?: number;
  display_order?: number;
  // Multi-language title support
  title_vn?: string;
  title_en?: string;
  title_cn?: string;
}

export interface KnowledgeListResponse {
  data: KnowledgePost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export class KnowledgeService {
  /**
   * Fetch paginated knowledge posts with optional filtering
   */
  static async getKnowledge(params: SearchParams = {}): Promise<ApiResponse<KnowledgePost[]>> {
    const queryParams: Record<string, string | number> = {};
    
    if (params.lang) queryParams.lang = params.lang;
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.category && params.category !== 'all') queryParams.category = params.category;
    if (params.search) queryParams.search = params.search;

    return await apiClient.get<KnowledgePost[]>('/api/knowledge', queryParams);
  }

  /**
   * Fetch a single knowledge post by ID
   */
  static async getKnowledgeById(id: string, lang?: string): Promise<ApiResponse<KnowledgePost>> {
    const params: Record<string, string> = {};
    if (lang) params.lang = lang;
    
    return await apiClient.get<KnowledgePost>(`/api/knowledge/${id}`, params);
  }

  /**
   * Fetch a single knowledge post by slug (recommended for SEO-friendly URLs)
   */
  static async getKnowledgeBySlug(slug: string, lang?: string): Promise<ApiResponse<KnowledgePost>> {
    const params: Record<string, string> = {};
    if (lang) params.lang = lang;
    
    return await apiClient.get<KnowledgePost>(`/api/knowledge/by-slug/${slug}`, params);
  }

  /**
   * Fetch knowledge posts by category
   */
  static async getKnowledgeByCategory(
    category: string, 
    params: SearchParams = {}
  ): Promise<ApiResponse<KnowledgePost[]>> {
    return await this.getKnowledge({
      ...params,
      category
    });
  }

  /**
   * Search knowledge posts
   */
  static async searchKnowledge(
    searchTerm: string, 
    params: SearchParams = {}
  ): Promise<ApiResponse<KnowledgePost[]>> {
    return await this.getKnowledge({
      ...params,
      search: searchTerm
    });
  }

  /**
   * Fetch knowledge posts by difficulty level
   */
  static async getKnowledgeByDifficulty(
    difficulty: string,
    params: SearchParams = {}
  ): Promise<ApiResponse<KnowledgePost[]>> {
    const queryParams: Record<string, string | number> = {
      ...params,
      difficulty
    };

    return await apiClient.get<KnowledgePost[]>('/api/knowledge', queryParams);
  }

  /**
   * Fetch featured knowledge posts
   */
  static async getFeaturedKnowledge(lang?: string, limit = 6): Promise<ApiResponse<KnowledgePost[]>> {
    const params: Record<string, string | number> = {
      featured: 'true',
      limit
    };
    if (lang) params.lang = lang;
    
    return await apiClient.get<KnowledgePost[]>('/api/knowledge', params);
  }

  /**
   * Fetch related knowledge posts (by category, excluding current post)
   */
  static async getRelatedKnowledge(
    currentSlug: string,
    category?: string,
    lang?: string,
    limit = 3
  ): Promise<ApiResponse<KnowledgePost[]>> {
    const params: SearchParams = {
      lang,
      limit,
      category
    };

    const response = await this.getKnowledge(params);
    
    // Filter out current post from related posts
    if (response.success && response.data) {
      response.data = response.data.filter(post => post.slug !== currentSlug);
      // Limit to requested number after filtering
      response.data = response.data.slice(0, limit);
    }

    return response;
  }

  /**
   * Generate breadcrumb navigation for knowledge post
   */
  static generateBreadcrumb(post: KnowledgePost): Array<{
    label: string;
    href: string;
  }> {
    const breadcrumb = [
      { label: 'Home', href: '/' },
      { label: 'Knowledge', href: '/knowledge' }
    ];

    if (post.category && post.category !== 'general') {
      breadcrumb.push({
        label: post.category.charAt(0).toUpperCase() + post.category.slice(1),
        href: `/knowledge?category=${post.category}`
      });
    }

    breadcrumb.push({
      label: post.title || post.title_vn || post.title_en || post.title_cn || 'Article',
      href: `/knowledge/${post.slug}`
    });

    return breadcrumb;
  }

  /**
   * Fetch knowledge categories
   */
  static async getCategories(lang?: string): Promise<ApiResponse<Category[]>> {
    const params: Record<string, string> = {};
    if (lang) params.lang = lang;
    
    return await apiClient.get<Category[]>('/api/knowledge/categories', params);
  }
}

// Export default instance
export const knowledgeService = KnowledgeService;