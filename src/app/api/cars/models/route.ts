import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  if (!directusUrl) {
    return NextResponse.json({ error: 'Directus URL not set' }, { status: 500 });
  }
  const { searchParams } = new URL(req.url);
  const brand_id = searchParams.get('brand_id');
  try {
    // Получаем все машины с нужным брендом (если задан)
    let carsUrl = `${directusUrl}/items/Cars?fields=series_id${brand_id ? ',brand_id' : ''}&limit=1000`;
    if (brand_id) {
      carsUrl += `&filter[brand_id][_eq]=${encodeURIComponent(brand_id)}`;
    }
    const carsRes = await fetch(carsUrl);
    if (!carsRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch cars', status: carsRes.status, statusText: carsRes.statusText }, { status: 500 });
    }
    const carsData = await carsRes.json();
    const usedSeriesIds = Array.from(new Set((carsData.data || []).map((c: { series_id: string }) => c.series_id).filter(Boolean)));
    if (usedSeriesIds.length === 0) return NextResponse.json({ series: [] });
    // Корректный фильтр для Directus: один параметр filter[id][_in]=id1,id2,id3
    const filterStr = `filter[id][_in]=${usedSeriesIds.join(',')}`;
    const seriesRes = await fetch(`${directusUrl}/items/series?fields=id,seriesname&limit=1000&${filterStr}`);
    if (!seriesRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch series', status: seriesRes.status, statusText: seriesRes.statusText }, { status: 500 });
    }
    // const seriesData = await seriesRes.json(); // удалено как неиспользуемое
    return NextResponse.json({ models: carsData.data.map((car: { model: string }) => car.model) });
  } catch (err: unknown) {
    const message = typeof err === 'object' && err && 'message' in err ? String((err as { message: unknown }).message) : String(err);
    return NextResponse.json({ error: 'Server error', message }, { status: 500 });
  }
} 