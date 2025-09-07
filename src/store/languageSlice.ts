import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import vnMessages from '../../messages/vn.json';

export type Locale = 'vn' | 'cn' | 'en';

interface LanguageState {
  currentLocale: Locale;
  messages: Record<string, unknown>;
}

const initialState: LanguageState = {
  currentLocale: 'vn',
  messages: vnMessages,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.currentLocale = action.payload;
    },
    setMessages: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.messages = action.payload;
    },
  },
});

export const { setLocale, setMessages } = languageSlice.actions;
export default languageSlice.reducer;