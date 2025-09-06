import {getRequestConfig} from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['vi', 'zh', 'en'] as const;
export const defaultLocale = 'vi';

export default getRequestConfig(async ({locale}) => {
  // Use default locale if none provided
  const currentLocale = locale || defaultLocale;
  
  return {
    locale: currentLocale,
    messages: (await import(`../messages/${currentLocale}.json`)).default
  };
});