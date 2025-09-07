// Legacy next-intl configuration - now using Redux for language management
// Can be imported from a shared config
export const locales = ['vi', 'zh', 'en'] as const;
export const defaultLocale = 'vi';

// No longer used - keeping for reference
// export default getRequestConfig(async ({locale}) => {
//   const currentLocale = locale || defaultLocale;
//   
//   return {
//     locale: currentLocale,
//     messages: (await import(`../messages/${currentLocale}.json`)).default
//   };
// });