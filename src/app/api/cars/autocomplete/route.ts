import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query') || '';
  if (!query || query.length < 2) return Response.json([]);

  // Параллельно ищем по carname, brand name, series name
  const [carsRes, brandsRes, seriesRes] = await Promise.all([
    fetch(`https://api.fluxcars.com/items/Cars?filter[carname][_icontains]=${encodeURIComponent(query)}&fields=carname&limit=5`),
    fetch(`https://api.fluxcars.com/items/brands?filter[name][_icontains]=${encodeURIComponent(query)}&fields=name&limit=5`),
    fetch(`https://api.fluxcars.com/items/series?filter[seriesname][_icontains]=${encodeURIComponent(query)}&fields=seriesname&limit=5`)
  ]);

  const carsData = await carsRes.json();
  const brandsData = await brandsRes.json();
  const seriesData = await seriesRes.json();

  const suggestions = Array.from(new Set([
    ...(carsData.data || []).map((c: { id: number; carname: string }) => c.carname),
    ...(brandsData.data || []).map((b: { name: string }) => b.name),
    ...(seriesData.data || []).map((s: { seriesname: string }) => s.seriesname)
  ].filter(Boolean)));

  const result = suggestions.map((carname: string) => ({
    id: 0,
    carname: carname,
  }));

  return Response.json(result);
} 