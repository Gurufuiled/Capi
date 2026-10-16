import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

const STORAGE_KEY = 'capi.telegramSyncConsent.v1';

type StoredConsent = { sharePhone: boolean; syncContacts: boolean };

type ConsentState = {
  hydrated: boolean;
  /** Пользователь уже ответил на вопрос о синхронизации после входа в Telegram. */
  decided: boolean;
  /** Записать номер Telegram в профиль Capi. */
  sharePhone: boolean;
  /** Найти знакомых из контактов телефона. */
  syncContacts: boolean;
  /** Нужно показать экран согласия. */
  promptVisible: boolean;
};

type ConsentActions = {
  hydrate: () => Promise<void>;
  showPrompt: () => void;
  decide: (choice: StoredConsent) => Promise<void>;
};

export const telegramConsentStore = create<ConsentState & ConsentActions>((set, get) => ({
  hydrated: false,
  decided: false,
  sharePhone: false,
  syncContacts: false,
  promptVisible: false,

  hydrate: async () => {
    if (get().hydrated) return;
    try {
      const raw = await SecureStore.getItemAsync(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoredConsent>;
        set({
          hydrated: true,
          decided: true,
          sharePhone: parsed.sharePhone === true,
          syncContacts: parsed.syncContacts === true,
        });
        return;
      }
    } catch {
      // нет сохранённого ответа или хранилище недоступно: спросим заново
    }
    set({ hydrated: true });
  },

  showPrompt: () => set({ promptVisible: true }),

  decide: async ({ sharePhone, syncContacts }) => {
    set({ decided: true, sharePhone, syncContacts, promptVisible: false });
    try {
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify({ sharePhone, syncContacts }));
    } catch {
      // ответ действует до перезапуска, при следующем входе спросим снова
    }
  },
}));
