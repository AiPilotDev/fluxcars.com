// src/app/cars/page.tsx
import type { Metadata } from 'next';
import CarsClient from './CarsClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Подбор авто из Китая с умными фильтрами и поиском',
  description: 'Точный подбор авто из Китая за 2 минуты! Умные фильтры и поиск экономят ваше время — выбирайте по цене, пробегу, году и комплектации без лишних вариантов.',
};

// SSR: вся логика фильтрации, поиска, пагинации, сортировки — на сервере
export default async function CarsPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // 1. Парсим query-параметры
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const limit = 16;
  const apiLimit = 40; // Берём с запасом
  const brand = typeof searchParams.brand === 'string' ? searchParams.brand : '';
  const series_id = typeof searchParams.series_id === 'string' ? searchParams.series_id : '';
  const year = typeof searchParams.year === 'string' ? searchParams.year : '';
  const mileage = typeof searchParams.mileage === 'string' ? searchParams.mileage : '';
  const price = typeof searchParams.price === 'string' ? searchParams.price : '';
  const search = typeof searchParams.search === 'string' ? searchParams.search : '';
  const color = typeof searchParams.color === 'string' ? searchParams.color : '';
  const engineVolume = typeof searchParams.engineVolume === 'string' ? searchParams.engineVolume : '';
  const sortField = typeof searchParams.sortField === 'string' ? searchParams.sortField : 'date_created';
  const sortOrder = typeof searchParams.sortOrder === 'string' ? searchParams.sortOrder : 'desc';

  // 2. Формируем фильтр для API
  const filter: Record<string, unknown> = {};
  if (brand) filter.brand_id = { _eq: brand };
  if (series_id) filter.series_id = { _eq: series_id };
  if (color) filter.color = { _eq: color };
  if (engineVolume) filter.engine_volume = { _eq: Number(engineVolume) };
  if (year) filter.year = { _eq: Number(year) };

  // Пробег от и до
  const mileageFrom = typeof searchParams.mileageFrom === 'string' ? searchParams.mileageFrom : '';
  const mileageTo = typeof searchParams.mileageTo === 'string' ? searchParams.mileageTo : '';
  if (mileageFrom && mileageTo) {
    filter.mileage = { _between: [Number(mileageFrom), Number(mileageTo)] };
  } else if (mileageFrom) {
    filter.mileage = { _gte: Number(mileageFrom) };
  } else if (mileageTo) {
    filter.mileage = { _lte: Number(mileageTo) };
  }

  // Цена от и до
  const priceFrom = typeof searchParams.priceFrom === 'string' ? searchParams.priceFrom : '';
  const priceTo = typeof searchParams.priceTo === 'string' ? searchParams.priceTo : '';
  if (priceFrom && priceTo) {
    filter.price = { _between: [Number(priceFrom), Number(priceTo)] };
  } else if (priceFrom) {
    filter.price = { _gte: Number(priceFrom) };
  } else if (priceTo) {
    filter.price = { _lte: Number(priceTo) };
  }

  if (search) {
    const words = search.split(/\s+/).filter(Boolean);
    if (words.length > 0) {
      filter._and = words.map(word => ({
        carname: { _icontains: word }
      }));
    }
  }

  // 3. Получаем список авто
  const params = new URLSearchParams();
  params.set('limit', String(apiLimit)); // увеличенный лимит
  params.set('page', String(page));
  params.set('sort', `${sortOrder === 'desc' ? '-' : ''}${sortField}`);
  params.set('meta', 'total_count,filter_count');
  params.set('fields', '*,brand_id.id,brand_id.name,series_id.id,series_id.seriesname');
  if (Object.keys(filter).length > 0) params.set('filter', JSON.stringify(filter));

  const carsRes = await fetch(`https://api.fluxcars.com/items/Cars?${params.toString()}`, { next: { revalidate: 60 } });
  const carsData = await carsRes.json();
  const cars = carsData.data || [];
  const totalCount = carsData.meta?.total_count || 0;
  const filterCount = carsData.meta?.filter_count || totalCount;

  // Фильтрация только валидных автомобилей
  const validCars = Array.isArray(cars)
    ? cars.filter(car =>
        car &&
        typeof car.id === 'number' &&
        typeof car.carname === 'string' &&
        car.brand_id && car.brand_id.name &&
        car.series_id && car.series_id.seriesname &&
        typeof car.price === 'number' &&
        typeof car.year === 'number' &&
        typeof car.mileage === 'number' &&
        car.thumbnail
      ).slice(0, limit) // Берём только первые 16 валидных
    : [];

  // Восстанавливаем подсчет brandCounts и popularBrands
  const brandCounts: Record<string, { id: number; name: string; count: number }> = {};
  for (const car of validCars) {
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
    .slice(0, 8);

  // Удаляем подсчет brandCounts и popularBrands, оставляем только уникальные бренды из validCars

  // 4. Получаем опции фильтров (бренды, серии, года, цвета, объемы)
  const [brandsRes, seriesRes, yearsRes] = await Promise.all([
    fetch('https://api.fluxcars.com/items/brands?fields=id,name&limit=1000', { next: { revalidate: 3600 } }),
    fetch('https://api.fluxcars.com/items/series?fields=id,seriesname,series_brand_id&limit=1000', { next: { revalidate: 3600 } }),
    fetch('https://api.fluxcars.com/items/Cars?fields=year,color,engine_volume&limit=1000', { next: { revalidate: 600 } })
  ]);
  const brands = (await brandsRes.json()).data || [];
  const series = (await seriesRes.json()).data || [];
  const carsForFilters = (await yearsRes.json()).data || [];
  const years = Array.from(new Set((carsForFilters.map((c: CarListItemType) => c.year) as number[])))
    .filter((v): v is number => typeof v === 'number' && !isNaN(v))
    .sort((a, b) => b - a);
  const colors = Array.from(new Set((carsForFilters.map((c: CarListItemType) => c.color) as string[])))
    .filter((v): v is string => typeof v === 'string' && v.length > 0)
    .sort();
  const engineVolumes = Array.from(new Set((carsForFilters.map((c: CarListItemType) => c.engine_volume) as number[])))
    .filter((v): v is number => typeof v === 'number' && !isNaN(v))
    .sort((a, b) => a - b);

  // Для диапазонов определяем минимальные и максимальные значения
  const minMileage = 0;
  const maxMileage = 300000;
  const minPrice = 0;
  const maxPrice = 100000;

  // Для ползунков: если значения не заданы, используем весь диапазон
  const mileageRange: [number, number] = [
    mileageFrom ? Number(mileageFrom) : minMileage,
    mileageTo ? Number(mileageTo) : maxMileage
  ];
  const priceRange: [number, number] = [
    priceFrom ? Number(priceFrom) : minPrice,
    priceTo ? Number(priceTo) : maxPrice
  ];
  const mileageRangeFormatted: [string, string] = [
    mileageRange[0].toLocaleString('ru-RU'),
    mileageRange[1].toLocaleString('ru-RU')
  ];
  const priceRangeFormatted: [string, string] = [
    priceRange[0].toLocaleString('ru-RU'),
    priceRange[1].toLocaleString('ru-RU')
  ];

  // 5. Передаем все в клиентский компонент
  // TODO: Прописать строгие типы пропсов CarsClient
  return (
    <>
      {/* Каталог авто */}
      <Suspense fallback={<div className="text-center py-12">Загрузка...</div>}>
        <CarsClient
          cars={validCars}
          totalCount={filterCount}
          currentPage={page}
          limit={limit}
          brands={brands}
          series={series}
          years={years}
          colors={colors}
          engineVolumes={engineVolumes}
          filters={{ brand, series_id, year, mileage, price, search, color, engineVolume, sortField, sortOrder }}
          mileageRangeFormatted={mileageRangeFormatted}
          priceRangeFormatted={priceRangeFormatted}
          popularBrands={popularBrands}
        />
      </Suspense>
    </>
  );
}

// Тип для автомобиля
interface CarListItemType {
  id: number;
  carname: string;
  brand_id: { id: number; name: string };
  series_id: { id: number; seriesname: string };
  [key: string]: unknown;
}