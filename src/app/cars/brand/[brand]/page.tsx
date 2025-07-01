import BrandPageClient from './BrandPageClient';
import { fetchBrands } from '@/lib/directus';

export async function generateMetadata({ params }: { params: { brand: string } }) {
  const brandName = decodeURIComponent(params.brand);
  return {
    title: `Автомобили ${brandName}`,
    description: `Купить автомобили ${brandName} из Китая. Каталог, цены, доставка, проверка, подбор.`,
  };
}

export default async function BrandPage({ params }: { params: { brand: string } }) {
  const brandParam = decodeURIComponent(params.brand);
  const brandsRes = await fetchBrands();
  const brands = brandsRes.data;
  // ищем по name или id
  const found = brands.find((b: { id: string; name: string }) => b.id === brandParam || b.name === brandParam);
  const realBrandName = found?.name || brandParam;
  const brandId = found?.id ? String(found.id) : '';
  return (
    <BrandPageClient
      initialBrand={realBrandName}
      initialBrandId={brandId}
      initialPage={1}
      initialSortField="date_created"
      initialSortOrder="desc"
    />
  );
} 