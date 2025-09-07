import { apiClient, ApiResponse } from './api';

export interface ContactFormData {
  full_name: string;
  email: string;
  phone: string;
  company?: string;
  service_type?: string;
  subject: string;
  message: string;
  priority?: string;
  language?: string;
  status?: string;
}

export interface ContactSubmissionResponse {
  id: string;
  message: string;
  submitted_at: string;
}

export class ContactService {
  /**
   * Submit a contact form
   */
  static async submitContact(formData: ContactFormData): Promise<ApiResponse<ContactSubmissionResponse>> {
    const submitData = {
      ...formData,
      status: formData.status || 'pending',
      submitted_at: new Date().toISOString()
    };

    return await apiClient.post<ContactSubmissionResponse>('/api/contacts', submitData);
  }

  /**
   * Submit a quick inquiry (simplified contact form)
   */
  static async submitQuickInquiry(data: {
    name: string;
    email: string;
    message: string;
    language?: string;
  }): Promise<ApiResponse<ContactSubmissionResponse>> {
    const formData: ContactFormData = {
      full_name: data.name,
      email: data.email,
      phone: '',
      subject: 'Quick Inquiry',
      message: data.message,
      priority: 'normal',
      language: data.language || 'vi',
      status: 'pending'
    };

    return await this.submitContact(formData);
  }

  /**
   * Submit a service request
   */
  static async submitServiceRequest(data: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    serviceType: string;
    message: string;
    language?: string;
  }): Promise<ApiResponse<ContactSubmissionResponse>> {
    const formData: ContactFormData = {
      full_name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      service_type: data.serviceType,
      subject: `Service Request: ${data.serviceType}`,
      message: data.message,
      priority: 'high',
      language: data.language || 'vi',
      status: 'pending'
    };

    return await this.submitContact(formData);
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone format (basic validation)
   */
  static isValidPhone(phone: string): boolean {
    // Allow various international formats
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
  }

  /**
   * Validate form data
   */
  static validateContactForm(data: Partial<ContactFormData>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.full_name?.trim()) {
      errors.push('Full name is required');
    }

    if (!data.email?.trim()) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!data.subject?.trim()) {
      errors.push('Subject is required');
    }

    if (!data.message?.trim()) {
      errors.push('Message is required');
    } else if (data.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    }

    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.push('Please enter a valid phone number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export default instance
export const contactService = ContactService;