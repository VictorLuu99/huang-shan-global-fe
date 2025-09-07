"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setMessages } from '../store/languageSlice';

const LanguageInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentLocale } = useSelector((state: RootState) => state.language);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        console.log(`LanguageInitializer: Loading messages for locale: ${currentLocale}`);
        const messagesModule = await import(`../../messages/${currentLocale}.json`);
        console.log('LanguageInitializer: Messages loaded successfully:', messagesModule);
        dispatch(setMessages(messagesModule.default));
        console.log('LanguageInitializer: Messages dispatched to store');
      } catch (error) {
        console.error(`LanguageInitializer: Failed to load messages for locale: ${currentLocale}`, error);
        // Fallback to Vietnamese
        try {
          console.log('LanguageInitializer: Loading fallback messages for vi');
          const fallbackMessages = await import(`../../messages/vi.json`);
          console.log('LanguageInitializer: Fallback messages loaded:', fallbackMessages);
          dispatch(setMessages(fallbackMessages.default));
        } catch (fallbackError) {
          console.error('LanguageInitializer: Failed to load fallback messages', fallbackError);
        }
      }
    };

    loadMessages();
  }, [currentLocale, dispatch]);

  return null; // This component doesn't render anything
};

export default LanguageInitializer;