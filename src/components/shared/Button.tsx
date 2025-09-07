'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  type = 'button',
  onClick
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-primary-foreground hover:bg-primary/80 border-primary';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-secondary';
      case 'outline':
        return 'bg-transparent text-foreground hover:bg-muted border-border';
      case 'ghost':
        return 'bg-transparent text-foreground hover:bg-muted border-transparent';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 border-red-600';
      default:
        return 'bg-primary text-primary-foreground hover:bg-primary/80 border-primary';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      disabled={isDisabled}
      type={type}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center space-x-2 font-medium rounded-lg border transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};

export default Button;