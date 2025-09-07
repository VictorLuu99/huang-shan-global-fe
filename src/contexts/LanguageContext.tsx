"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Import translation files
import viMessages from '../../messages/vi.json';
import zhMessages from '../../messages/zh.json';
import enMessages from '../../messages/en.json';

console.log('LanguageContext: Static imports loaded:', {
  vi: typeof viMessages,
  zh: typeof zhMessages,
  en: typeof enMessages,
  viSample: viMessages?.hero?.title,
  zhSample: zhMessages?.hero?.title,
  enSample: enMessages?.hero?.title
});

export type Locale = 'vi' | 'zh' | 'en';

interface LanguageContextType {
  currentLocale: Locale;
  messages: Record<string, any>;
  changeLanguage: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get nested translation
function getNestedTranslation(obj: any, path: string): string {
  const result = path.split('.').reduce((current, key) => current?.[key], obj);
  
  // Always return a string - if result is an object or undefined, return the key as fallback
  if (typeof result === 'string') {
    return result;
  } else if (typeof result === 'object' && result !== null) {
    console.warn(`Translation key "${path}" returned an object instead of string:`, result);
    return `[Object: ${path}]`;
  } else {
    console.warn(`Translation key "${path}" not found`);
    return path;
  }
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  console.log('LanguageProvider: Component rendered/re-rendered');
  const [currentLocale, setCurrentLocale] = useState<Locale>('vi');
  
  // Initialize with Vietnamese messages immediately
  console.log('LanguageProvider: Initializing messages directly with viMessages');
  const [messages, setMessages] = useState<Record<string, any>>(viMessages || {});
  
  console.log('LanguageProvider: State initialized - currentLocale:', currentLocale, 'messages keys:', Object.keys(messages));

  const changeLanguage = (locale: Locale) => {
    console.log(`LanguageProvider: Changing language to: ${locale}`);
    setCurrentLocale(locale);
    
    // Load messages immediately based on locale
    const messageMap = {
      vi: viMessages,
      zh: zhMessages,
      en: enMessages,
    };
    
    const localeMessages = messageMap[locale];
    if (localeMessages && typeof localeMessages === 'object') {
      console.log('LanguageProvider: Switching messages for locale:', locale, 'keys:', Object.keys(localeMessages).slice(0, 10));
      setMessages(localeMessages);
    } else {
      console.error(`LanguageProvider: No messages found for locale: ${locale}`);
      setMessages(viMessages || {});
    }
  };

  const t = (key: string): string => {
    if (Object.keys(messages).length === 0) {
      console.log(`LanguageProvider: No messages loaded yet for key: ${key}`);
      return key;
    }
    return getNestedTranslation(messages, key);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLocale,
        messages,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};