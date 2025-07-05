import { NextResponse } from 'next/server';

const DOMAIN = 'https://fluxcars.com';
const PAGE_SIZE = 5000;

export async function GET() {
  // Получаем общее количество авто
  const res = await fetch('https://api.fluxcars.com/items/Cars?meta=total_count&limit=1');
  const data = await res.json();
  const total = data.meta?.total_count || 0;
  const sitemapsCount = Math.ceil(total / PAGE_SIZE);

  let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  for (let i = 1; i <= sitemapsCount; i++) {
    sitemapIndex += `\n  <sitemap><loc>${DOMAIN}/sitemap/${i}.xml</loc></sitemap>`;
  }
  // Главные страницы
  sitemapIndex += `\n  <sitemap><loc>${DOMAIN}/</loc></sitemap>`;
  sitemapIndex += `\n  <sitemap><loc>${DOMAIN}/cars</loc></sitemap>`;
  sitemapIndex += `\n  <sitemap><loc>${DOMAIN}/about</loc></sitemap>`;
  sitemapIndex += `\n  <sitemap><loc>${DOMAIN}/policy</loc></sitemap>`;
  sitemapIndex += '\n</sitemapindex>';

  return new NextResponse(sitemapIndex, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
// use context7 