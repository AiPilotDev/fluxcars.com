import HomeClient from './HomeClient';

const API_URL = 'https://api.fluxcars.com/items';

async function fetchBrands() {
  const res = await fetch(`${API_URL}/brands?fields=id,name&sort=name&limit=1000`, { cache: 'no-store' });
  const data = await res.json();
  return data;
}

async function fetchSeries() {
  const res = await fetch(`${API_URL}/series?fields=id,seriesname,series_brand_id`, { cache: 'no-store' });
  const data = await res.json();
  return data;
}

// search: строка поиска (по бренду, серии, названию)
async function fetchNewCars(search?: string, brand?: string, model?: string) {
  let url = `${API_URL}/Cars?sort=-date_created&limit=8&fields=*,brand_id.id,brand_id.name,series_id.id,series_id.seriesname`;
  const filter: Record<string, unknown> = {};
  if (search && search.trim()) {
    filter._or = [
      { 'brand_id.name': { _icontains: search } },
      { 'series_id.seriesname': { _icontains: search } },
      { carname: { _icontains: search } }
    ];
  }
  if (brand) filter.brand_id = { _eq: brand };
  if (model) filter.series_id = { _eq: model };
  if (Object.keys(filter).length > 0) {
    url += `&filter=${encodeURIComponent(JSON.stringify(filter))}`;
  }
  const res = await fetch(url, { cache: 'no-store' });
  const data = await res.json();
  return data;
}

async function fetchAllCarsBrands() {
  const res = await fetch(`${API_URL}/Cars?fields=brand_id.id,brand_id.name&limit=10000`, { cache: 'no-store' });
  const data = await res.json();
  return data;
}

export const metadata = {
  title: "Купить авто из Китая — 100 000+ проверенных предложений | Безопасная сделка",
  description: "Платформа для поиска и доставки автомобилей из Китая. Гарантия безопасности сделки, проверка истории",
};

export default async function HomePage(props: { searchParams?: Promise<{ search?: string, brand?: string, model?: string }> }) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const [brands, series, newCars, allCarsBrands] = await Promise.all([
    fetchBrands(),
    fetchSeries(),
    fetchNewCars(searchParams?.search, searchParams?.brand, searchParams?.model),
    fetchAllCarsBrands()
  ]);

  // Вычисляем топ-10 популярных брендов по всем авто
  const brandCounts: Record<string, { id: number; name: string; count: number }> = {};
  for (const car of allCarsBrands.data || []) {
    if (car.brand_id && car.brand_id.id && car.brand_id.name) {
      const id = car.brand_id.id;
      if (!brandCounts[id]) {
        brandCounts[id] = { id, name: car.brand_id.name, count: 0 };
      }
      brandCounts[id].count++;
    }
  }
  const popularBrands = Object.values(brandCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return <HomeClient brands={brands.data || []} seriesList={series.data || []} newCars={newCars.data || []} popularBrands={popularBrands} />;
}
