import { telegramConsentStore } from '../stores/telegramConsentStore';
import { requestContactsAndSync } from './ContactSyncService';
import { syncChatusPhoneFromTelegramAuth } from './telegramChatusPhoneSync';

/**
 * Что делать сразу после входа в Telegram: номер в профиль Capi и импорт контактов
 * выполняются только с согласия пользователя. Пока ответа нет, показываем экран согласия.
 */
export async function runTelegramPostLoginSync(): Promise<void> {
  const store = telegramConsentStore.getState();
  await store.hydrate();
  const { decided, sharePhone, syncContacts } = telegramConsentStore.getState();
  if (!decided) {
    telegramConsentStore.getState().showPrompt();
    return;
  }
  await applyTelegramSync({ sharePhone, syncContacts });
}

export async function applyTelegramSync(choice: {
  sharePhone: boolean;
  syncContacts: boolean;
}): Promise<void> {
  if (choice.sharePhone) {
    await syncChatusPhoneFromTelegramAuth().catch(console.error);
  }
  if (choice.syncContacts) {
    await requestContactsAndSync().catch(console.error);
  }
}
