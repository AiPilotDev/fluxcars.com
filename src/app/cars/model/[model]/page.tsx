import { Suspense } from 'react';
import ModelPageClient from './ModelPageClient';
import { Metadata } from 'next';

type SortField = 'year' | 'mileage' | 'price' | 'date_created';

async function getBrandFromModel(model: string): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) {
    return null;
  }

  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/Cars`);
    url.searchParams.append('filter[model][_eq]', model);
    url.searchParams.append('fields', 'brand');
    url.searchParams.append('limit', '1');
    
    const response = await fetch(url.toString(), { next: { revalidate: 60 }, headers: { 'Content-Type': 'application/json' } });
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data?.[0]?.brand || null;
  } catch (error) {
    console.error('Error fetching brand:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ model: string }>;
}): Promise<Metadata> {
  const { model } = await params;
  const decodedModel = decodeURIComponent(model);
  
  // Получаем бренд из API
  const brand = await getBrandFromModel(decodedModel);
  
  const title = brand 
    ? `Купить авто ${brand} ${decodedModel}`
    : `Купить авто ${decodedModel}`;
    
  const description = brand
    ? `Широкий выбор автомобилей ${brand} ${decodedModel} в Беларуси. Новые и подержанные авто ${brand} ${decodedModel} с гарантией. Лучшие цены на ${brand} ${decodedModel} в Минске и по всей Беларуси.`
    : `Широкий выбор автомобилей ${decodedModel} в Беларуси. Новые и подержанные авто ${decodedModel} с гарантией. Лучшие цены на ${decodedModel} в Минске и по всей Беларуси.`;

  return {
    title,
    description,
    keywords: brand 
      ? `${brand} ${decodedModel}, купить ${brand} ${decodedModel}, автомобили ${brand} ${decodedModel}, авто ${brand} ${decodedModel} Беларусь, ${brand} ${decodedModel} Минск`
      : `${decodedModel}, купить ${decodedModel}, автомобили ${decodedModel}, авто ${decodedModel} Беларусь, ${decodedModel} Минск`,
  };
}

export default async function ModelPage({
  params,
  searchParams,
}: {
  params: Promise<{ model: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}) {
  const { model } = await params;
  const decodedModel = decodeURIComponent(model);
  
  const { page, sort } = await searchParams;
  const currentPage = Number(page) || 1;
  
  const sortField = (sort?.split('-')[1] || 'date_created') as SortField;
  const sortOrder = sort?.startsWith('-') ? 'desc' : 'asc';

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ModelPageClient
        initialModel={decodedModel}
        initialPage={currentPage}
        initialSortField={sortField}
        initialSortOrder={sortOrder}
      />
    </Suspense>
  );
} 