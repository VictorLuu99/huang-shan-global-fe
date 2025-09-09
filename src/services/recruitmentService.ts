import { apiClient, ApiResponse, SearchParams } from './api';

export interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string; // full-time, part-time, contract, etc.
  experience: string;
  salary_range?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  created_at: string;
  application_deadline?: string;
  status: string; // active, closed, draft
  featured?: boolean;
  language?: string;
}

export interface JobApplication {
  job_id: string;
  full_name: string;
  email: string;
  phone: string;
  current_position?: string;
  experience_years?: number;
  education?: string;
  skills?: string[];
  cover_letter: string;
  cv_url?: string;
  language?: string;
  status?: string;
}

export interface ApplicationResponse {
  id: string;
  message: string;
  application_number: string;
  submitted_at: string;
}

export class RecruitmentService {
  /**
   * Fetch all job listings with optional filtering
   */
  static async getJobs(params: SearchParams = {}): Promise<ApiResponse<JobListing[]>> {
    const queryParams: Record<string, string | number> = {};
    
    if (params.lang) queryParams.lang = params.lang;
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.category && params.category !== 'all') queryParams.department = params.category;
    if (params.search) queryParams.search = params.search;

    return await apiClient.get<JobListing[]>('/api/recruitment', queryParams);
  }

  /**
   * Fetch a single job listing by ID
   */
  static async getJobById(id: string, lang?: string): Promise<ApiResponse<JobListing>> {
    const params: Record<string, string> = {};
    if (lang) params.lang = lang;
    
    return await apiClient.get<JobListing>(`/api/recruitment/${id}`, params);
  }

  /**
   * Fetch featured job listings
   */
  static async getFeaturedJobs(lang?: string, limit = 6): Promise<ApiResponse<JobListing[]>> {
    const params: Record<string, string | number> = {
      featured: 'true',
      limit
    };
    if (lang) params.lang = lang;
    
    return await apiClient.get<JobListing[]>('/api/recruitment', params);
  }

  /**
   * Fetch jobs by department
   */
  static async getJobsByDepartment(
    department: string, 
    params: SearchParams = {}
  ): Promise<ApiResponse<JobListing[]>> {
    return await this.getJobs({
      ...params,
      category: department
    });
  }

  /**
   * Search job listings
   */
  static async searchJobs(
    searchTerm: string, 
    params: SearchParams = {}
  ): Promise<ApiResponse<JobListing[]>> {
    return await this.getJobs({
      ...params,
      search: searchTerm
    });
  }

  /**
   * Submit job application
   */
  static async submitApplication(
    jobId: string, 
    applicationData: Omit<JobApplication, 'job_id'>
  ): Promise<ApiResponse<ApplicationResponse>> {
    const submitData: JobApplication = {
      job_id: jobId,
      ...applicationData,
      status: 'submitted'
    };

    return await apiClient.post<ApplicationResponse>(`/api/cv/apply/${jobId}`, submitData);
  }

  /**
   * Validate job application data
   */
  static validateApplication(data: Partial<JobApplication>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.full_name?.trim()) {
      errors.push('Full name is required');
    }

    if (!data.email?.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!data.phone?.trim()) {
      errors.push('Phone number is required');
    }

    if (!data.cover_letter?.trim()) {
      errors.push('Cover letter is required');
    } else if (data.cover_letter.trim().length < 50) {
      errors.push('Cover letter must be at least 50 characters long');
    }

    if (data.experience_years !== undefined && (data.experience_years < 0 || data.experience_years > 50)) {
      errors.push('Please enter a valid number of years of experience');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Format job posting date
   */
  static formatPostingDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }

  /**
   * Check if job application deadline has passed
   */
  static isApplicationExpired(deadline?: string): boolean {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  }
}

// Export default instance
export const recruitmentService = RecruitmentService;