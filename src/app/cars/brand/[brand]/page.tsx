import { Suspense } from 'react';
import BrandPageClient from './BrandPageClient';
import { Metadata } from 'next';

type SortField = 'year' | 'mileage' | 'price' | 'date_created';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const { brand } = await params;
  const decodedBrand = decodeURIComponent(brand);

  return {
    title: `Каталог авто ${decodedBrand} из Китая на FluxCars`,
    description: `Покупка ${decodedBrand} в Китае на FluxCars. Поиск и доставка из любой точки Китая ${decodedBrand} с гарантией. Цены от официальных дилеров и частных продавцов. ${decodedBrand} Доставка по всему миру.`,
  };
}

export default async function BrandPage({
  params,
  searchParams,
}: {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}) {
  const { brand } = await params;
  const decodedBrand = decodeURIComponent(brand);
  
  const { page, sort } = await searchParams;
  const currentPage = Number(page) || 1;
  
  const sortField = (sort?.split('-')[1] || 'date_created') as SortField;
  const sortOrder = sort?.startsWith('-') ? 'desc' : 'asc';

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrandPageClient
        initialBrand={decodedBrand}
        initialPage={currentPage}
        initialSortField={sortField}
        initialSortOrder={sortOrder}
      />
    </Suspense>
  );
} 