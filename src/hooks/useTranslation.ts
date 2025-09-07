import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setLocale, setMessages, Locale } from '../store/languageSlice';

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

export const useTranslation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentLocale, messages } = useSelector((state: RootState) => state.language);

  const changeLanguage = async (locale: Locale) => {
    dispatch(setLocale(locale));
    // Load messages for the new locale
    try {
      console.log(`useTranslation: Loading messages for locale: ${locale}`);
      const messagesModule = await import(`../../messages/${locale}.json`);
      console.log('useTranslation: Messages loaded successfully:', messagesModule);
      dispatch(setMessages(messagesModule.default));
      console.log('useTranslation: Messages dispatched to store');
    } catch (error) {
      console.error(`useTranslation: Failed to load messages for locale: ${locale}`, error);
    }
    console.log(`Language changed to: ${locale}`);
  };

  const t = (key: string): string => {
    if (Object.keys(messages).length === 0) {
      console.log(`No messages loaded yet for key: ${key}`);
    }
    return getNestedTranslation(messages, key);
  };

  return {
    currentLocale,
    changeLanguage,
    t,
  };
};