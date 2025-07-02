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

async function getSeriesIdByName(seriesName: string): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return null;
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/series`);
    url.searchParams.append('filter[seriesname][_eq]', seriesName);
    url.searchParams.append('fields', 'id');
    url.searchParams.append('limit', '1');
    const response = await fetch(url.toString(), { next: { revalidate: 3600 }, headers: { 'Content-Type': 'application/json' } });
    if (!response.ok) return null;
    const data = await response.json();
    return data.data?.[0]?.id ? String(data.data[0].id) : null;
  } catch {
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
    ? `Автомобили ${brand} модели ${decodedModel} из Китая. Выкуп и доставка`
    : `Купить авто ${decodedModel} в Китае`;
    
  const description = brand
    ? `Автомобили ${brand} модели ${decodedModel} из Китая. Выкуп и доставка`
    : ` ${decodedModel} поиск и покупка в Китае. Новые и б/у ${decodedModel}`;
  
  return {
    title,
    description
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
  
  // Получаем id серии по названию модели
  const seriesId = await getSeriesIdByName(decodedModel);
  const modelIdForClient = seriesId || decodedModel;

  const { page, sort } = await searchParams;
  const currentPage = Number(page) || 1;
  
  const sortField = (sort?.split('-')[1] || 'date_created') as SortField;
  const sortOrder = sort?.startsWith('-') ? 'desc' : 'asc';

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ModelPageClient
        initialModel={modelIdForClient}
        initialPage={currentPage}
        initialSortField={sortField}
        initialSortOrder={sortOrder}
      />
    </Suspense>
  );
} 