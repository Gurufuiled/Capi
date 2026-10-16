/**
 * Контрактный тест оформления экрана настроек Capi (вариант V3: плоский список без карточек, четыре группы,
 * «Скоро» приглушённо, камера на аватаре). Проверяем по исходникам: экран слишком тяжёлый для юнит-рендера.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { darkPalette, lightPalette } from '../theme/palettes';

const settings = readFileSync(join(__dirname, 'SettingsScreen.tsx'), 'utf8');

// группы идут в порядке макета
const groups = ['Подключения', 'Приложение', 'Безопасность', 'Поддержка'];
let last = -1;
for (const title of groups) {
  const at = settings.indexOf(`<Text style={styles.groupLabel}>${title}</Text>`);
  assert.ok(at > last, `группа «${title}» отсутствует или стоит не по порядку`);
  last = at;
}

// строки внутри групп — в порядке макета
const rowOrder = [
  'title="Telegram"',
  'title="Сервисы"',
  'title="Оформление"',
  'title="Настройки чатов"',
  'title="Уведомления и звуки"',
  'title="Язык"',
  'title="Данные и память"',
  'title="Конфиденциальность"',
  'title="Пароль и безопасность"',
  'title="Устройства"',
  'title="Сообщить о баге"',
  'title="Предложения"',
];
last = -1;
for (const row of rowOrder) {
  const at = settings.indexOf(row);
  assert.ok(at > last, `строка ${row} отсутствует или стоит не по порядку`);
  last = at;
}
assert.ok(settings.indexOf('Выйти из аккаунта') > last, 'выход стоит последним');

// нереализованные разделы помечены «Скоро» (проп `soon`) и приглушены, рабочие — нет
assert.equal((settings.match(/^\s+soon$/gm) ?? []).length, 6, 'ровно 6 разделов «Скоро»');
assert.match(settings, /telegramConnectionMeta\.subtitle/);
assert.match(settings, /Изменить фотографию/);
assert.match(settings, /settings-hero-camera/, 'значок камеры на аватаре');

// карточек и старых подписей нет
assert.doesNotMatch(settings, /Мини-приложения и ChatusFather/);
assert.doesNotMatch(settings, />Обратная связь</);
assert.doesNotMatch(settings, /styles\.card\b/, 'экран без карточек');

// палитры: одинаковые ключи, светлая и тёмная различаются
for (const key of Object.keys(lightPalette) as (keyof typeof lightPalette)[]) {
  assert.ok(darkPalette[key] !== undefined, `в тёмной палитре нет ${key}`);
}
assert.notEqual(lightPalette.chatBackground, darkPalette.chatBackground);
assert.equal(lightPalette.accent, '#6D3FE0');

console.log('settingsLayout.test.ts: ok');
