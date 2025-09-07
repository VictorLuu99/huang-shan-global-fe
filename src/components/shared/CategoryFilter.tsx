'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'tabs';
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  className = '',
  variant = 'default'
}) => {
  const getVariantStyles = (isSelected: boolean) => {
    switch (variant) {
      case 'pills':
        return isSelected
          ? 'bg-primary text-primary-foreground shadow-md'
          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground';
      case 'tabs':
        return isSelected
          ? 'border-b-2 border-primary text-primary bg-primary/5'
          : 'border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:border-border';
      default:
        return isSelected
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground hover:bg-muted/80';
    }
  };

  const getContainerStyles = () => {
    switch (variant) {
      case 'tabs':
        return 'flex overflow-x-auto border-b border-border';
      default:
        return 'flex flex-wrap justify-center gap-3';
    }
  };

  const getButtonStyles = (category: Category) => {
    const isSelected = selectedCategory === category.id;
    const baseStyles = variant === 'tabs' 
      ? 'px-4 py-3 font-medium transition-all whitespace-nowrap'
      : 'px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap';
    
    return `${baseStyles} ${getVariantStyles(isSelected)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${getContainerStyles()} ${className}`}
    >
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;
        
        return (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={getButtonStyles(category)}
            whileTap={{ scale: 0.95 }}
            layout
          >
            <div className="flex items-center space-x-2">
              {category.icon && (
                <span className="flex-shrink-0">
                  {category.icon}
                </span>
              )}
              <span>{category.label}</span>
              {category.count !== undefined && (
                <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                  isSelected 
                    ? 'bg-primary-foreground/20 text-primary-foreground' 
                    : 'bg-foreground/10 text-foreground/70'
                }`}>
                  {category.count}
                </span>
              )}
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default CategoryFilter;