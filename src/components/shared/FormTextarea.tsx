'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormTextareaProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  showCharacterCount?: boolean;
  className?: string;
  textareaClassName?: string;
}

const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  rows = 4,
  maxLength,
  showCharacterCount = false,
  className = '',
  textareaClassName = ''
}) => {
  const characterCount = value.length;
  const showCount = showCharacterCount || maxLength;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3 bg-background border rounded-lg transition-colors resize-vertical
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-50
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-border'}
            ${textareaClassName}
          `}
        />

        {/* Character Count */}
        {showCount && (
          <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
            {maxLength ? `${characterCount}/${maxLength}` : characterCount}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormTextarea;