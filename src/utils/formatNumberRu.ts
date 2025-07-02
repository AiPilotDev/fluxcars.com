export function formatNumberRu(num?: number) {
  return typeof num === 'number' ? num.toLocaleString('ru-RU') : '';
} 