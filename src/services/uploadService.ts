import { apiClient } from './api';

export interface FileUploadResult {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export class UploadService {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  /**
   * Validate file before upload
   */
  static validateFile(file: File): FileValidationResult {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds 10MB limit. Current size: ${Math.round(file.size / 1024 / 1024 * 100) / 100}MB`
      };
    }

    // Check file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Only PDF, DOC, and DOCX files are allowed'
      };
    }

    return { valid: true };
  }

  /**
   * Upload file to server
   */
  static async uploadFile(file: File): Promise<FileUploadResult> {
    try {
      // Validate file first
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload to API using the centralized client
      const response = await apiClient.post<{
        url: string;
        filename: string;
      }>('/api/upload', formData, {
        headers: {
          'X-File-Name': encodeURIComponent(file.name),
        },
      });

      if (response.success && response.data) {
        return {
          success: true,
          fileUrl: response.data.url,
          fileName: response.data.filename || file.name,
          fileSize: file.size
        };
      } else {
        throw new Error(response.error || 'Upload failed');
      }

    } catch (error) {
      console.error('File upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  /**
   * Upload multiple files
   */
  static async uploadMultipleFiles(files: File[]): Promise<FileUploadResult[]> {
    const results: FileUploadResult[] = [];
    
    for (const file of files) {
      const result = await this.uploadFile(file);
      results.push(result);
    }
    
    return results;
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file extension from filename
   */
  static getFileExtension(filename: string): string {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  /**
   * Generate safe filename with timestamp
   */
  static generateSafeFileName(originalName: string): string {
    const timestamp = Date.now();
    const extension = this.getFileExtension(originalName);
    const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
    
    return `${baseName}_${timestamp}.${extension}`;
  }

  /**
   * Check if file type is supported
   */
  static isFileTypeSupported(file: File): boolean {
    return this.ALLOWED_TYPES.includes(file.type);
  }

  /**
   * Check if file size is within limits
   */
  static isFileSizeValid(file: File): boolean {
    return file.size <= this.MAX_FILE_SIZE;
  }

  /**
   * Get human-readable file type description
   */
  static getFileTypeDescription(mimeType: string): string {
    const typeMap: Record<string, string> = {
      'application/pdf': 'PDF Document',
      'application/msword': 'Word Document',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document'
    };
    
    return typeMap[mimeType] || 'Unknown Document';
  }

  /**
   * Create file preview information
   */
  static createFilePreview(file: File): {
    name: string;
    size: string;
    type: string;
    lastModified: string;
    isValid: boolean;
    validationError?: string;
  } {
    const validation = this.validateFile(file);
    
    return {
      name: file.name,
      size: this.formatFileSize(file.size),
      type: this.getFileTypeDescription(file.type),
      lastModified: new Date(file.lastModified).toLocaleDateString('vi-VN'),
      isValid: validation.valid,
      validationError: validation.error
    };
  }
}

// Export default instance
export const uploadService = UploadService;