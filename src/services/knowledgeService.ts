import { apiClient, ApiResponse, SearchParams } from './api';

export interface KnowledgePost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  published_at: string;
  read_time?: string;
  views?: number;
  difficulty?: string;
  image_url?: string;
  tags?: string[];
  slug?: string;
  status: string;
}

export interface KnowledgeListResponse {
  data: KnowledgePost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class KnowledgeService {
  /**
   * Fetch paginated knowledge posts with optional filtering
   */
  static async getKnowledge(params: SearchParams = {}): Promise<ApiResponse<KnowledgePost[]>> {
    const queryParams: Record<string, string | number> = {};
    
    // if (params.lang) queryParams.lang = params.lang;
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
}

// Export default instance
export const knowledgeService = KnowledgeService;