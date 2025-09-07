"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Import translation files
import vnMessages from '../../messages/vn.json';
import cnMessages from '../../messages/cn.json';
import enMessages from '../../messages/en.json';

// console.log('LanguageContext: Static imports loaded:', {
//   vi: typeof viMessages,
//   zh: typeof zhMessages,
//   en: typeof enMessages,
//   viSample: viMessages?.hero?.title,
//   zhSample: zhMessages?.hero?.title,
//   enSample: enMessages?.hero?.title
// });

export type Locale = 'vn' | 'cn' | 'en';

interface LanguageContextType {
  currentLocale: Locale;
  messages: Record<string, unknown>;
  changeLanguage: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get nested translation
function getNestedTranslation(obj: Record<string, unknown>, path: string): string {
  const result = path.split('.').reduce((current: unknown, key: string) => {
    return (current as Record<string, unknown>)?.[key];
  }, obj);
  
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
  const [currentLocale, setCurrentLocale] = useState<Locale>('vn');
  
  // Initialize with Vietnamese messages immediately
  const [messages, setMessages] = useState<Record<string, unknown>>(vnMessages || {});

  const changeLanguage = (locale: Locale) => {
    setCurrentLocale(locale);
    
    // Load messages immediately based on locale
    const messageMap = {
      vn: vnMessages,
      cn: cnMessages,
      en: enMessages,
    };
    
    const localeMessages = messageMap[locale];
    if (localeMessages && typeof localeMessages === 'object') {
      setMessages(localeMessages);
    } else {
      setMessages(vnMessages || {});
    }
  };

  const t = (key: string): string => {
    if (Object.keys(messages).length === 0) {
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