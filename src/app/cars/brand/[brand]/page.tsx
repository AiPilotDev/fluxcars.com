import BrandPageClient from './BrandPageClient';
import { fetchBrands } from '@/lib/directus';

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  const brandName = decodeURIComponent(brand);
  return {
    title: `Автомобили ${brandName}`,
    description: `Купить автомобили ${brandName} из Китая. Каталог, цены, доставка, проверка, подбор.`,
  };
}

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  const brandParam = decodeURIComponent(brand);
  const brandsRes = await fetchBrands();
  const brands = brandsRes.data;
  const found = brands.find((b) => String(b.id) === brandParam || b.name === brandParam);
  const realBrandName = found?.name || brandParam;
  const brandId = found?.id ? String(found.id) : '';

  // SSR-загрузка серий (моделей) для бренда
  let seriesList: { id: number; name: string }[] = [];
  if (brandId) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/series?filter[series_brand_id][_eq]=${brandId}&fields=id,seriesname&limit=5000`
    );
    const data = await res.json();
    seriesList = (data.data || []).map((s: any) => ({ id: s.id, name: s.seriesname }));
  }

  return (
    <BrandPageClient
      initialBrand={realBrandName}
      initialBrandId={brandId}
      initialPage={1}
      initialSortField="date_created"
      initialSortOrder="desc"
      initialSeriesList={seriesList}
    />
  );
} 