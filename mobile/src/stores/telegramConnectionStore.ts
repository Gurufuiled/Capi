import { create } from 'zustand';

/** Состояние соединения TDLib (`updateConnectionState`). */
export type TelegramConnectionState =
  | 'unknown'
  | 'ready'
  | 'waiting_network'
  | 'connecting_proxy'
  | 'connecting'
  | 'updating';

type State = {
  connection: TelegramConnectionState;
  setConnection: (connection: TelegramConnectionState) => void;
};

export function mapTdConnectionState(type: string | undefined): TelegramConnectionState {
  switch (type) {
    case 'connectionStateReady':
      return 'ready';
    case 'connectionStateWaitingForNetwork':
      return 'waiting_network';
    case 'connectionStateConnectingToProxy':
      return 'connecting_proxy';
    case 'connectionStateConnecting':
      return 'connecting';
    case 'connectionStateUpdating':
      return 'updating';
    default:
      return 'unknown';
  }
}

export const telegramConnectionStore = create<State>((set) => ({
  connection: 'unknown',
  setConnection: (connection) => set({ connection }),
}));
