'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick
}) => {
  const getPaddingStyles = () => {
    switch (padding) {
      case 'none': return '';
      case 'sm': return 'p-4';
      case 'lg': return 'p-8';
      default: return 'p-6';
    }
  };

  const Component = hover || onClick ? motion.div : 'div';
  const motionProps = hover || onClick ? {
    whileHover: { y: -2 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      className={`
        bg-card border border-border rounded-xl overflow-hidden
        ${hover ? 'hover:shadow-lg hover:border-primary/20 transition-all duration-300' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${getPaddingStyles()}
        ${className}
      `}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

export default Card;