'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Car } from '@/types/directus';
import { useEffect, useState } from 'react';

interface CarListItemProps {
  car: Car;
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

export default function CarListItem({ car }: CarListItemProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getImageUrl = (thumbnail: string | null): string => {
    if (!thumbnail) return '/images/car-placeholder.jpg';
    
    if (thumbnail.startsWith('http')) {
      return thumbnail;
    }
    
    return `${process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'}/assets/${thumbnail}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={getImageUrl(car.thumbnail)}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={process.env.NODE_ENV === 'development'}
        />
        <div className="absolute top-2 right-2">
          <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Year */}
        <div className="flex justify-between items-start mb-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900" suppressHydrationWarning>
              Model: {car.model}
            </h3>
            <h4 className="text-base text-gray-600" suppressHydrationWarning>
            Brand: {car.brand} 
            </h4>
          </div>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded" suppressHydrationWarning>
            {car.year}
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-xl font-bold text-blue-600" suppressHydrationWarning>
            ${isClient ? formatNumber(car.price) : car.price.toLocaleString()}
          </p>
        </div>

        {/* Parameters Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span suppressHydrationWarning>{isClient ? formatNumber(car.mileage) : car.mileage.toLocaleString()} км</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Проверен</span>
          </div>
        </div>

        {/* Details Link */}
        <Link 
          href={`/cars/${car.infoid}`} 
          className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Подробнее
        </Link>
      </div>
    </div>
  );
} 