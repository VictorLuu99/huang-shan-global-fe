'use client';

import React from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

interface FormInputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'url';
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  inputClassName?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  inputClassName = ''
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}

        {/* Input Field */}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-3 bg-background border rounded-lg transition-colors
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-50
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon || type === 'password' ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-border'}
            ${inputClassName}
          `}
        />

        {/* Right Icon or Password Toggle */}
        {(rightIcon || type === 'password') && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {type === 'password' ? (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            ) : (
              <div className="text-muted-foreground">
                {rightIcon}
              </div>
            )}
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

export default FormInput;