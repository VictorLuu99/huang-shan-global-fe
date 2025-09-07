'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
  variant?: 'default' | 'overlay' | 'inline';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  className = '',
  variant = 'default'
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'md': return 'w-6 h-6';
      case 'lg': return 'w-8 h-8';
      case 'xl': return 'w-12 h-12';
      default: return 'w-6 h-6';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-sm';
      case 'md': return 'text-base';
      case 'lg': return 'text-lg';
      case 'xl': return 'text-xl';
      default: return 'text-base';
    }
  };

  const spinner = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <Loader2 
        className={`${getSizeClass()} text-primary animate-spin`}
      />
      {message && (
        <p className={`${getTextSize()} text-muted-foreground text-center`}>
          {message}
        </p>
      )}
    </motion.div>
  );

  if (variant === 'overlay') {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="inline-flex items-center space-x-2">
        <Loader2 className={`${getSizeClass()} text-primary animate-spin`} />
        {message && (
          <span className={`${getTextSize()} text-muted-foreground`}>
            {message}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;