/** Русское склонение по числу: pluralRu(1, ['подписчик', 'подписчика', 'подписчиков']) → «подписчик». */
export function pluralRu(count: number, forms: readonly [string, string, string]): string {
  const n = Math.abs(Math.trunc(count));
  const mod100 = n % 100;
  const mod10 = n % 10;
  if (mod100 >= 11 && mod100 <= 14) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
}

/** «1 подписчик», «2 подписчика», «5 подписчиков». */
export function countWithPlural(count: number, forms: readonly [string, string, string]): string {
  return `${count} ${pluralRu(count, forms)}`;
}

export const SUBSCRIBER_FORMS = ['подписчик', 'подписчика', 'подписчиков'] as const;
export const MEMBER_FORMS = ['участник', 'участника', 'участников'] as const;
export const COMMENT_FORMS = ['комментарий', 'комментария', 'комментариев'] as const;
