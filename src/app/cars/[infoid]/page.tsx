import { notFound } from 'next/navigation';
import ImageGallery from './ImageGallery';
import SimilarCars from './SimilarCars';
import { Metadata } from 'next';
import Link from 'next/link';
import { Car as DirectusCar } from '@/types/directus';
import DescriptionWrapper from './DescriptionWrapper';
import ContactsBlock from './ContactsBlock';
import { formatError } from '@/utils/formatError';
import { formatPrice } from '@/utils/formatPrice';
import { formatNumberRu } from '@/utils/formatNumberRu';
import { fetchBrands, fetchAllSeries, getSeriesMap } from '@/lib/directus';
import { Brand } from '@/types/directus';
import { Series } from '@/types/directus';
import React from 'react';

interface CarPageData {
  id: string;
  infoid: number;
  carname: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  delivery_price: number;
  engine_volume: number;
  condition: string;
  transmission: string;
  fuel_type: string;
  car_type: string;
  vin: string;
  color: string;
  acceleration: number;
  range: number;
  battery_power: number;
  description: string;
  thumbnail: string | null;
  images: Array<{
    directus_files_id: {
      id: string;
    };
  }>;
  brand_id: string;
  series_id: string;
}

async function getCar(infoid: number): Promise<CarPageData | null> {
  if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) {
    console.error('NEXT_PUBLIC_DIRECTUS_URL is not defined');
    return null;
  }

  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/Cars`);
    url.searchParams.append('filter[infoid][_eq]', infoid.toString());
    url.searchParams.append('fields', '*,images.*,images.directus_files_id.*');
    
    const response = await fetch(url.toString(), { next: { revalidate: 60 }, headers: { 'Content-Type': 'application/json' } });
    
    if (!response.ok) {
      console.error('Failed to fetch car:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (!data?.data?.length) {
      console.log('No car found with infoid:', infoid);
      return null;
    }

    return data.data[0] as CarPageData;
  } catch (error) {
    console.error('Error fetching car:', formatError(error));
    return null;
  }
}

async function getAllCars(): Promise<DirectusCar[]> {
  if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) {
    console.error('NEXT_PUBLIC_DIRECTUS_URL is not defined');
    return [];
  }
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/Cars`);
    url.searchParams.append('fields', 'id,carname,brand_id,series_id,year,price,images');
    url.searchParams.append('limit', '100');
    const response = await fetch(url.toString(), { next: { revalidate: 60 }, headers: { 'Content-Type': 'application/json' } });
    if (!response.ok) {
      console.error('Failed to fetch cars:', response.status, response.statusText);
      return [];
    }
    const data = await response.json();
    return data.data as DirectusCar[];
  } catch (error) {
    console.error('Error fetching cars:', formatError(error));
    return [];
  }
}

function InfoItem({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value || '—'}</span>
    </div>
  );
}

function CarData({ car, allCars, brands, seriesMap }: { car: CarPageData; allCars: DirectusCar[]; brands: Brand[]; seriesMap: Record<number, string> }) {
  const brandName = brands.find(b => b.id === Number(car.brand_id))?.name || '—';
  const seriesName = seriesMap[Number(car.series_id)] || '—';
  const formattedPrice = formatPrice(car.price, 'USD');
  const formattedDeliveryPrice = car.delivery_price > 0 ? formatPrice(car.delivery_price, 'USD') : '';
  const formattedMileage = car.mileage ? formatNumberRu(car.mileage) : '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-900 to-purple-900 text-white w-full">
        <div className="container mx-auto px-4 py-6 sm:py-12 max-w-full sm:max-w-7xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4" suppressHydrationWarning>
             {car.carname} - {car.fuel_type}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-200 text-sm sm:text-base">
            <Link 
              href={`/cars/brand/${encodeURIComponent(brandName)}`}
              className="hover:text-white transition-colors"
            >
              {brandName}
            </Link>
            <span>•</span>
            <Link 
              href={car.series_id ? `/cars/model/${encodeURIComponent(seriesName)}` : '#'}
              className="hover:text-white transition-colors"
            >
              {seriesName}
            </Link>
            <span>•</span>
            <Link 
              href={`/cars/year/${car.year}`}
              className="hover:text-white transition-colors"
            >
              {car.year}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Car Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            {car.images && car.images.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  
                  <ImageGallery images={car.images.map(img => img.directus_files_id.id)} />
                </div>
              </div>
            )}

            {/* Price and Contact Cards - Mobile Only */}
            <div className="lg:hidden space-y-8">
              {/* Price Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4" suppressHydrationWarning>Цена</h2>
                  <div className="space-y-2">
                    <p className="text-4xl font-bold">{formattedPrice}</p>
                    {car.delivery_price > 0 && (
                      <p className="text-indigo-100">Доставка: {formattedDeliveryPrice}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4" suppressHydrationWarning>Дополнительная информация</h2>
                <div className="space-y-4">
                  <InfoItem label="Пробег" value={formattedMileage ? `${formattedMileage} км` : null} />
                  <InfoItem label="Год выпуска" value={car.year?.toString()} />
                  <InfoItem label="Марка" value={brandName} />
                  <InfoItem label="Серия" value={seriesName} />
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4" suppressHydrationWarning>Технические характеристики</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <InfoItem label="Объем двигателя" value={car.engine_volume ? `${car.engine_volume} л` : null} />
                    <InfoItem label="Состояние" value={car.condition} />
                    <InfoItem label="Коробка передач" value={car.transmission} />
                    <InfoItem label="Тип топлива" value={car.fuel_type} />
                    <InfoItem label="Цвет" value={car.color} />
                  </div>
                  <div className="space-y-4">
                    <InfoItem label="VIN" value={car.vin} />
                    <InfoItem label="Тип кузова" value={car.car_type} />
                    <InfoItem label="Разгон до 100 км/ч" value={car.acceleration ? `${car.acceleration} сек` : null} />
                    <InfoItem label="Запас хода" value={car.range ? `${car.range} км` : null} />
                    <InfoItem label="Мощность батареи" value={car.battery_power ? `${car.battery_power} кВт⋅ч` : null} />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact and ContactsBlock for mobile only */}
            <div className="lg:hidden space-y-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4" suppressHydrationWarning>Связаться с нами</h2>
                  <div className="space-y-4">
                    <a
                      href={`https://t.me/chinamotor_bot`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full bg-[#0088cc] text-white px-4 py-3 rounded-lg hover:bg-[#0077b3] transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.25.38-.51 1.05-.78 4.12-1.79 6.87-2.97 8.26-3.54 3.93-1.61 4.75-1.89 5.24-1.9.11 0 .37.03.54.17.14.12.18.28.2.45-.02.14-.02.3-.04.42z"/>
                      </svg>
                      <span className="text-lg font-medium">Telegram</span>
                    </a>
                    <a
                      href={`https://connect.viber.com/ru/business/467d53c8-1703-11f0-b10f-36482bc6d4ae`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full bg-[#7360f2] text-white px-4 py-3 rounded-lg hover:bg-[#5d4cd9] transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 15.5c-.28 0-.5-.22-.5-.5v-2.5c0-.28.22-.5.5-.5s.5.22.5.5v2.5c0 .28-.22.5-.5.5zm3-3c-.28 0-.5-.22-.5-.5v-2.5c0-.28.22-.5.5-.5s.5.22.5.5v2.5c0 .28-.22.5-.5.5zm-6 0c-.28 0-.5-.22-.5-.5v-2.5c0-.28.22-.5.5-.5s.5.22.5.5v2.5c0 .28-.22.5-.5.5zm3-3c-.28 0-.5-.22-.5-.5v-2.5c0-.28.22-.5.5-.5s.5.22.5.5v2.5c0 .28-.22.5-.5.5z"/>
                      </svg>
                      <span className="text-lg font-medium">Viber</span>
                    </a>
                    <a
                      href={`https://wa.me/447822032515`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white px-4 py-3 rounded-lg hover:bg-[#1da851] transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.14 15.86c-1.73 0-3.43-.5-4.92-1.44l-3.55.91.97-3.46c-1.03-1.61-1.58-3.47-1.58-5.41 0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.41-6.05c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.07-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.46-.01-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.39 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.47-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.28z"/>
                      </svg>
                      <span className="text-lg font-medium">WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
              <ContactsBlock />
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4" suppressHydrationWarning>Описание</h2>
                <DescriptionWrapper description={car.description} />
              </div>
            </div>
          </div>

          {/* Right Column - Price and Contact - Desktop Only */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-8 transition-all duration-300">
              {/* Price Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4" suppressHydrationWarning>Цена</h2>
                  <div className="space-y-2">
                    <p className="text-4xl font-bold">{formattedPrice}</p>
                    {car.delivery_price > 0 && (
                      <p className="text-indigo-100">Стоимость с доставкой:  {formattedDeliveryPrice}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Card (Moved) */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4" suppressHydrationWarning>Связаться с нами</h2>
                  <div className="space-y-4">
                    <a
                      href={`https://t.me/chinamotor_bot`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full bg-[#0088cc] text-white px-4 py-3 rounded-lg hover:bg-[#0077b3] transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.25.38-.51 1.05-.78 4.12-1.79 6.87-2.97 8.26-3.54 3.93-1.61 4.75-1.89 5.24-1.9.11 0 .37.03.54.17.14.12.18.28.2.45-.02.14-.02.3-.04.42z"/>
                      </svg>
                      <span className="text-lg font-medium">Telegram</span>
                    </a>
                    <a
                      href={`https://connect.viber.com/ru/business/467d53c8-1703-11f0-b10f-36482bc6d4ae`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full bg-[#7360f2] text-white px-4 py-3 rounded-lg hover:bg-[#5d4cd9] transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 15.5c-.28 0-.5-.22-.5-.5v-2.5c0-.28.22-.5.5-.5s.5.22.5.5v2.5c0 .28-.22.5-.5.5zm3-3c-.28 0-.5-.22-.5-.5v-2.5c0-.28.22-.5.5-.5s.5.22.5.5v2.5c0 .28-.22.5-.5.5zm-6 0c-.28 0-.5-.22-.5-.5v-2.5c0-.28.22-.5.5-.5s.5.22.5.5v2.5c0 .28-.22.5-.5.5zm3-3c-.28 0-.5-.22-.5-.5v-2.5c0-.28.22-.5.5-.5s.5.22.5.5v2.5c0 .28-.22.5-.5.5z"/>
                      </svg>
                      <span className="text-lg font-medium">Viber</span>
                    </a>
                    <a
                      href={`https://wa.me/447822032515`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white px-4 py-3 rounded-lg hover:bg-[#1da851] transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.14 15.86c-1.73 0-3.43-.5-4.92-1.44l-3.55.91.97-3.46c-1.03-1.61-1.58-3.47-1.58-5.41 0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.41-6.05c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.07-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.46-.01-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.39 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.47-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.28z"/>
                      </svg>
                      <span className="text-lg font-medium">WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
              <ContactsBlock />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function CarPage({ params }: { params: Promise<{ infoid: string }> }) {
  const { infoid } = await params;
  const infoidNum = parseInt(infoid);
  if (isNaN(infoidNum)) {
    notFound();
  }
  const [car, allCars, brandsRes, seriesMap] = await Promise.all([
    getCar(infoidNum),
    getAllCars(),
    fetchBrands(),
    getSeriesMap()
  ]);
  const brands = brandsRes.data;
  if (!car) {
    notFound();
  }
  return <CarData car={car} allCars={allCars} brands={brands} seriesMap={seriesMap} />;
}

export async function generateMetadata({ params }: { params: Promise<{ infoid: string }> }): Promise<Metadata> {
  const { infoid } = await params;
  const car = await getCar(Number(infoid));
  
  if (!car) {
    return {
      title: 'Автомобиль не найден',
      description: 'Запрашиваемый автомобиль не найден в каталоге'
    };
  }

  return {
    title: `Купить ${car.carname} в Китае - ${car.year} г. Стоимость ${car.price}|${car.color}`,
    description: `Покупка и доставка ${car.carname} из Китая. Стоимость $${car.price}. Цвет: ${car.color} Марка: ${car.brand}. Серия: ${car.series_id ? car.series_id : '—'} ${car.year} года -${car.fuel_type}`,
    openGraph: {
      title: `Купить ${car.carname} в Китае - ${car.year} г. Стоимость ${car.price}|${car.color}`,
      description: `Покупка и доставка ${car.carname} из Китая. Стоимость $${car.price}. Цвет: ${car.color} Марка: ${car.brand}. Серия: ${car.series_id ? car.series_id : '—'} ${car.year} года -${car.fuel_type}`,
      type: 'website',
      locale: 'ru_RU',
    }
  };
}