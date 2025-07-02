'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Car } from '@/types/directus';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getImageUrl } from '@/utils/getImageUrl';
import { formatNumberRu } from '@/utils/formatNumberRu';

interface FeaturedCarsSliderProps {
  cars: (Car & { priceFormatted: string; mileageFormatted: string })[];
  brands: { id: string; name: string }[];
  seriesList: { id: string; name: string }[];
}

export default function FeaturedCarsSlider({ cars, brands, seriesList }: FeaturedCarsSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % cars.length);
  }, [cars.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + cars.length) % cars.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL!;
  const getImage = (thumbnail: string | null) => getImageUrl(thumbnail, directusUrl);

  return (
    <div className="relative bg-white rounded-b-xl shadow-lg overflow-hidden">
      <div className="relative h-[500px]">
        {cars.map((car, index) => (
          <div
            key={car.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative h-full flex">
              {/* Left Card - 1/3 width */}
              <div className="w-1/3 bg-black p-8 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-2 text-white">{brands.find(b => b.id === car.brand_id)?.name || '—'} {seriesList.find(s => s.id === car.series_id)?.name || '—'}</h2>
                <p className="text-xl mb-6 text-gray-300">Авто из нашей подборки</p>
                <div className="grid grid-cols-1 gap-6 mb-8">
                  <div>
                    <p className="text-sm text-gray-400">Год выпуска</p>
                    <p className="text-lg font-semibold text-white">{car.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Пробег</p>
                    <p className="text-lg font-semibold text-white">{formatNumberRu(car.mileage)} км</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Цена</p>
                    <p className="text-lg font-semibold text-white">${formatNumberRu(car.price)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Цвет</p>
                    <p className="text-lg font-semibold text-white">{car.color || 'Не указан'}</p>
                  </div>
                </div>
                <Link
                  href={`/cars/${car.infoid}`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Подробнее
                </Link>
              </div>

              {/* Right Image - 2/3 width */}
              <div className="w-2/3 relative">
                <Image
                  src={getImage(car.thumbnail)}
                  alt={`${brands.find(b => b.id === car.brand_id)?.name || '—'} ${seriesList.find(s => s.id === car.series_id)?.name || '—'}`}
                  fill
                  className="object-cover"
                  sizes="66vw"
                  priority={index === 0}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {cars.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
} 