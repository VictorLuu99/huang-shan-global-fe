import { uploadService, FileUploadResult } from '../services/uploadService';

// Re-export types and main functionality from the service layer
export type { FileUploadResult };

/**
 * @deprecated Use uploadService from '../services/uploadService' instead
 * This class is maintained for backward compatibility
 */
export class FileUploadService {
  static validateFile(file: File) {
    return uploadService.validateFile(file);
  }

  static async uploadFile(file: File): Promise<FileUploadResult> {
    return await uploadService.uploadFile(file);
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static getFileExtension(filename: string): string {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  static generateSafeFileName(originalName: string): string {
    const timestamp = Date.now();
    const extension = this.getFileExtension(originalName);
    const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
    
    return `${baseName}_${timestamp}.${extension}`;
  }
}