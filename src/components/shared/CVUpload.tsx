'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { FileUploadService, FileUploadResult } from '@/utils/fileUpload';

interface CVUploadProps {
  onUploadComplete: (result: FileUploadResult) => void;
  onUploadStart?: () => void;
  onUploadError?: (error: string) => void;
  currentFile?: {
    name: string;
    url: string;
    size?: number;
  } | null;
  disabled?: boolean;
  className?: string;
}

export default function CVUpload({
  onUploadComplete,
  onUploadStart,
  onUploadError,
  currentFile,
  disabled = false,
  className = ''
}: CVUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setValidationError(null);

    // Validate file
    const validation = FileUploadService.validateFile(file);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid file');
      onUploadError?.(validation.error || 'Invalid file');
      return;
    }

    // Start upload
    setUploading(true);
    onUploadStart?.();

    try {
      const result = await FileUploadService.uploadFile(file);
      
      if (result.success) {
        onUploadComplete(result);
      } else {
        setValidationError(result.error || 'Upload failed');
        onUploadError?.(result.error || 'Upload failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setValidationError(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    if (disabled || uploading) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !uploading) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setValidationError(null);
    onUploadComplete({
      success: true,
      fileUrl: '',
      fileName: '',
      fileSize: 0
    });
  };

  const openFileDialog = () => {
    if (!disabled && !uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer
          ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:bg-blue-50'}
          ${validationError ? 'border-red-300 bg-red-50' : ''}
          ${currentFile?.name ? 'border-green-300 bg-green-50' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        {uploading ? (
          // Uploading State
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
            <p className="text-sm text-blue-600 font-medium">Uploading your CV...</p>
            <p className="text-xs text-gray-500 mt-1">Please wait while we process your file</p>
          </div>
        ) : currentFile?.name ? (
          // File Uploaded State
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                  {currentFile.name}
                </p>
                {currentFile.size && (
                  <p className="text-xs text-gray-500">
                    {FileUploadService.formatFileSize(currentFile.size)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : validationError ? (
          // Error State
          <div className="flex flex-col items-center">
            <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm text-red-600 font-medium mb-1">Upload Failed</p>
            <p className="text-xs text-red-500 text-center">{validationError}</p>
            <button
              type="button"
              onClick={() => setValidationError(null)}
              className="mt-2 text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Try again
            </button>
          </div>
        ) : (
          // Default Upload State
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Upload your CV or Resume
            </p>
            <p className="text-xs text-gray-500 mb-2">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-gray-400">
              PDF, DOC, DOCX • Max 10MB
            </p>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-3 text-xs text-gray-500">
        <p>• Supported formats: PDF, Word Document (.doc, .docx)</p>
        <p>• Maximum file size: 10 MB</p>
        <p>• Make sure your CV includes your contact information and work experience</p>
      </div>
    </div>
  );
}