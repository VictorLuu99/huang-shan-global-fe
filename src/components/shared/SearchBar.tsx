'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  value,
  onChange,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
    </div>
  );
};

export default SearchBar;