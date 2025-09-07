'use client';

import { memo } from 'react';

interface OptimizedLoaderProps {
  message?: string;
  className?: string;
}

const OptimizedLoader = memo<OptimizedLoaderProps>(({ 
  message = "Loading...", 
  className = "min-h-screen" 
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-muted-foreground text-sm font-medium">{message}</p>
      </div>
    </div>
  );
});

OptimizedLoader.displayName = 'OptimizedLoader';

export default OptimizedLoader;