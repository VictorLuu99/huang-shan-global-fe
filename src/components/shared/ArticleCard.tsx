'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Tag, Star, User } from 'lucide-react';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  readingTime?: number;
  publishedDate?: string;
  author?: string;
  featured?: boolean;
  tags?: string[];
  image?: string;
  onClick?: () => void;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  excerpt,
  category,
  readingTime,
  publishedDate,
  author,
  featured = false,
  tags = [],
  image,
  onClick,
  actionButton,
  className = ''
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Image or Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
        {image ? (
          <div 
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            role="img"
            aria-label={title}
          />
        ) : (
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
            <Tag className="w-8 h-8 text-primary" />
          </div>
        )}
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center space-x-1">
              <Star className="w-3 h-3 fill-current" />
              <span>Featured</span>
            </span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-2 py-1 bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium rounded-full">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {excerpt}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-4">
            {readingTime && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min</span>
              </div>
            )}
            {author && (
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{author}</span>
              </div>
            )}
          </div>
          {publishedDate && (
            <span>{publishedDate}</span>
          )}
        </div>

        {/* Action Button */}
        {actionButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              actionButton.onClick();
            }}
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/80 transition-colors"
          >
            {actionButton.label}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ArticleCard;