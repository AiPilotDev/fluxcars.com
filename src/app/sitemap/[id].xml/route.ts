import { NextRequest, NextResponse } from 'next/server';

const DOMAIN = 'https://fluxcars.com';
const PAGE_SIZE = 5000;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = Number(id);
  if (!page || page < 1) {
    return new NextResponse('Not found', { status: 404 });
  }
  // Получаем нужную порцию авто
  const offset = (page - 1) * PAGE_SIZE;
  const carsRes = await fetch(`https://api.fluxcars.com/items/Cars?fields=infoid,carname,brand_id.name,series_id.seriesname&limit=${PAGE_SIZE}&offset=${offset}`);
  const carsData = await carsRes.json();
  const cars = carsData.data || [];

  // Получаем бренды
  const brandsRes = await fetch('https://api.fluxcars.com/items/brands?fields=name&limit=1000');
  const brandsData = await brandsRes.json();
  const brands = brandsData.data || [];

  // Получаем модели (series)
  const seriesRes = await fetch('https://api.fluxcars.com/items/series?fields=seriesname&limit=5000');
  const seriesData = await seriesRes.json();
  const series = seriesData.data || [];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  // Авто
  for (const car of cars) {
    xml += `\n  <url><loc>${DOMAIN}/cars/${car.infoid}</loc></url>`;
  }
  // Бренды
  for (const brand of brands) {
    xml += `\n  <url><loc>${DOMAIN}/cars/brand/${encodeURIComponent(brand.name)}</loc></url>`;
  }
  // Модели
  for (const s of series) {
    xml += `\n  <url><loc>${DOMAIN}/cars/model/${encodeURIComponent(s.seriesname)}</loc></url>`;
  }
  xml += '\n</urlset>';

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
// use context7 