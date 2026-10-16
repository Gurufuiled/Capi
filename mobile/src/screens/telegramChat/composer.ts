/** Payload helpers shared by composer sends (InputBar → TDLib). */

export function fileUriToPath(uri: string): string {
  const path = decodeURIComponent(uri.trim().replace(/^file:\/\//, '')).replace(/\/+$/, '');
  if (!path) {
    throw new Error('TDLib media file path is empty');
  }
  return path;
}

export function getLocalInputFile(uri: string): Record<string, unknown> {
  return {
    '@type': 'inputFileLocal',
    path: fileUriToPath(uri),
  };
}

export function getInputThumbnail(
  uri: string,
  width: number,
  height: number,
): Record<string, unknown> {
  return {
    '@type': 'inputThumbnail',
    thumbnail: getLocalInputFile(uri),
    width: Math.max(1, Math.round(width)),
    height: Math.max(1, Math.round(height)),
  };
}

/** TDLib `inputMessageVideoNote` (кружок), не `inputMessageVideo`. */
export function buildInputMessageVideoNoteContent(params: {
  videoUri: string;
  thumbnailUri?: string | null;
  durationMs: number;
  lengthPx: number;
}): Record<string, unknown> {
  const lengthPx = Math.min(640, Math.max(240, Math.round(params.lengthPx)));
  const durationSec = Math.max(1, Math.min(60, Math.round(params.durationMs / 1000)));
  const thumbUri = params.thumbnailUri?.trim();
  return {
    '@type': 'inputMessageVideoNote',
    video_note: getLocalInputFile(params.videoUri),
    thumbnail: thumbUri ? getInputThumbnail(thumbUri, lengthPx, lengthPx) : null,
    duration: durationSec,
    length: lengthPx,
  };
}

export function formattedText(text?: string): Record<string, unknown> {
  return {
    '@type': 'formattedText',
    text: text?.trim() ?? '',
    entities: [],
  };
}

export { formatMessageTime as formatTime } from '../../utils/formatMessageTime';

export function previewForUnsupported(kind: string | undefined): string {
  switch (kind) {
    case 'messagePhoto':
      return 'Фото';
    case 'messageVideo':
      return 'Видео';
    case 'messageVideoNote':
      return 'Видеосообщение';
    case 'messageDocument':
      return 'Файл';
    case 'messageSticker':
      return 'Стикер';
    case 'messageAnimation':
      return 'GIF';
    case 'messagePoll':
      return 'Опрос · откройте в Telegram';
    case 'messageLocation':
    case 'messageVenue':
      return 'Геопозиция';
    case 'messageContact':
      return 'Контакт';
    case 'messageCall':
      return 'Звонок';
    case 'messagePinMessage':
      return 'Сообщение закреплено';
    case 'messageChatAddMembers':
      return 'В чат добавлены участники';
    case 'messageChatJoinByLink':
    case 'messageChatJoinByRequest':
      return 'Новый участник вступил в чат';
    case 'messageChatDeleteMember':
      return 'Участник покинул чат';
    case 'messageChatChangeTitle':
      return 'Название чата изменено';
    case 'messageChatChangePhoto':
      return 'Фото чата изменено';
    case 'messageChatDeletePhoto':
      return 'Фото чата удалено';
    case 'messageBasicGroupChatCreate':
    case 'messageSupergroupChatCreate':
      return 'Чат создан';
    case 'messageScreenshotTaken':
      return 'Сделан снимок экрана';
    default:
      return 'Сообщение';
  }
}

export function getInputReplyTo(messageId: number | null): Record<string, unknown> | undefined {
  if (messageId == null || messageId <= 0) return undefined;
  return {
    '@type': 'inputMessageReplyToMessage',
    message_id: messageId,
    quote: null,
    checklist_task_id: 0,
  };
}
