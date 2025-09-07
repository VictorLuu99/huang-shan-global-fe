import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import viMessages from '../../messages/vi.json';

export type Locale = 'vi' | 'zh' | 'en';

interface LanguageState {
  currentLocale: Locale;
  messages: Record<string, any>;
}

const initialState: LanguageState = {
  currentLocale: 'vi',
  messages: viMessages,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.currentLocale = action.payload;
    },
    setMessages: (state, action: PayloadAction<Record<string, any>>) => {
      state.messages = action.payload;
    },
  },
});

export const { setLocale, setMessages } = languageSlice.actions;
export default languageSlice.reducer;