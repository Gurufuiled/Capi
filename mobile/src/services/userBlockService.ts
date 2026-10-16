import { apiDelete, apiGet, apiPost } from './apiClient';

async function assertOk(res: Response, fallback: string): Promise<void> {
  if (res.ok) return;
  let message = fallback;
  try {
    const body = (await res.json()) as { message?: string | string[] };
    const raw = Array.isArray(body.message) ? body.message.join(', ') : body.message;
    if (raw) message = raw;
  } catch {
    // тело не JSON: оставляем текст по умолчанию
  }
  throw new Error(message);
}

/** Серверная блокировка: заблокированный не может писать и звонить, и наоборот. */
export async function blockUserOnServer(userId: string): Promise<void> {
  const res = await apiPost(`/users/${encodeURIComponent(userId)}/block`);
  await assertOk(res, 'Не удалось заблокировать пользователя');
}

export async function unblockUserOnServer(userId: string): Promise<void> {
  const res = await apiDelete(`/users/${encodeURIComponent(userId)}/block`);
  await assertOk(res, 'Не удалось разблокировать пользователя');
}

export async function fetchBlockedUserIds(): Promise<string[]> {
  const res = await apiGet('/users/me/blocks');
  await assertOk(res, 'Не удалось загрузить список заблокированных');
  const body = (await res.json()) as { blocked_user_ids?: string[] };
  return Array.isArray(body.blocked_user_ids) ? body.blocked_user_ids : [];
}
