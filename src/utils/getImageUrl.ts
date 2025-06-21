export function getImageUrl(thumbnail: string | null, directusUrl: string): string {
  if (!thumbnail) return '/images/car-placeholder.jpg';
  if (thumbnail.startsWith('http')) return thumbnail;
  return `${directusUrl}/assets/${thumbnail}`;
} 