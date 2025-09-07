// Base API service layer for Huang Shan logistics website
// Centralizes API configuration and provides consistent error handling

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export class ApiClient {
  private static readonly DEFAULT_API_URL = 'https://huangshan-api.xox-labs-server.workers.dev';
  
  private readonly baseUrl: string;
  
  constructor() {
    // Use environment variable with fallback to default production URL
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || ApiClient.DEFAULT_API_URL;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      if (isJson) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Use default error message if JSON parsing fails
        }
      }

      throw new Error(errorMessage);
    }

    if (isJson) {
      return await response.json();
    }

    // For non-JSON responses, wrap in standard format
    return {
      success: true,
      data: await response.text() as T
    };
  }

  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<ApiResponse<T>> {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error(`API GET ${endpoint} error:`, error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const isFormData = data instanceof FormData;
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          ...(!isFormData && { 'Content-Type': 'application/json' }),
          ...options?.headers,
        },
        body: isFormData ? data : JSON.stringify(data),
        ...options,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error(`API POST ${endpoint} error:`, error);
      throw error;
    }
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error(`API PUT ${endpoint} error:`, error);
      throw error;
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error(`API DELETE ${endpoint} error:`, error);
      throw error;
    }
  }

  // Utility method to get the base URL (useful for file uploads, etc.)
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

// Common API types
export interface PaginationParams {
  page?: number;
  limit?: number;
  lang?: string;
}

export interface SearchParams extends PaginationParams {
  search?: string;
  category?: string;
}

// Error handling utilities
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

export const isApiError = (error: unknown): error is ApiError => {
  return typeof error === 'object' && error !== null && 'message' in error;
};