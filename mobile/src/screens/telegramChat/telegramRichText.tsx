import React from 'react';
import { Linking, Text, type StyleProp, type TextStyle } from 'react-native';

import type { TelegramTextEntity } from './types';

type RichTextColors = {
  /** Цвет ссылок, @упоминаний и #хештегов. */
  link: string;
  /** Фон блоков кода. */
  codeBackground: string;
};

function openLink(url: string) {
  const target = /^[a-z][a-z0-9+.-]*:/i.test(url) ? url : `https://${url}`;
  void Linking.openURL(target).catch(() => undefined);
}

function stylesFor(active: TelegramTextEntity[], colors: RichTextColors): TextStyle {
  const style: TextStyle = {};
  const decorations: string[] = [];
  for (const entity of active) {
    switch (entity.type) {
      case 'bold':
        style.fontWeight = '700';
        break;
      case 'italic':
        style.fontStyle = 'italic';
        break;
      case 'underline':
        decorations.push('underline');
        break;
      case 'strike':
        decorations.push('line-through');
        break;
      case 'code':
      case 'pre':
        style.fontFamily = 'monospace';
        style.backgroundColor = colors.codeBackground;
        break;
      case 'url':
      case 'text_url':
        style.color = colors.link;
        decorations.push('underline');
        break;
      case 'mention':
      case 'hashtag':
        style.color = colors.link;
        break;
      case 'spoiler':
        break;
    }
  }
  if (decorations.length > 0) {
    style.textDecorationLine = decorations.join(' ') as TextStyle['textDecorationLine'];
  }
  return style;
}

/**
 * Разворачивает текст Telegram с форматированием (`entities`) во вложенные `Text`:
 * жирный, курсив, код, ссылки, @упоминания, #хештеги. Пересекающиеся диапазоны складываются.
 */
export function renderTelegramRichText(
  text: string,
  entities: TelegramTextEntity[] | undefined,
  baseStyle: StyleProp<TextStyle>,
  colors: RichTextColors,
): React.ReactNode {
  if (!entities || entities.length === 0 || text.length === 0) return text;

  const boundaries = new Set<number>([0, text.length]);
  for (const entity of entities) {
    boundaries.add(Math.max(0, Math.min(text.length, entity.offset)));
    boundaries.add(Math.max(0, Math.min(text.length, entity.offset + entity.length)));
  }
  const points = [...boundaries].sort((a, b) => a - b);

  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const start = points[i];
    const end = points[i + 1];
    if (end <= start) continue;
    const active = entities.filter(
      (entity) => entity.offset <= start && entity.offset + entity.length >= end,
    );
    const chunk = text.slice(start, end);
    if (active.length === 0) {
      nodes.push(chunk);
      continue;
    }
    const link = active.find((entity) => entity.type === 'url' || entity.type === 'text_url');
    nodes.push(
      <Text
        key={`${start}-${end}`}
        style={[baseStyle, stylesFor(active, colors)]}
        onPress={link ? () => openLink(link.type === 'text_url' ? link.url ?? chunk : chunk) : undefined}
      >
        {chunk}
      </Text>,
    );
  }
  return nodes;
}
