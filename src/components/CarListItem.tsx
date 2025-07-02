'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Car } from '@/types/directus';
import { getImageUrl } from '@/utils/getImageUrl';
import { formatNumberRu } from '@/utils/formatNumberRu';

interface CarListItemProps {
  car: Car;
}

export default function CarListItem({ car }: CarListItemProps) {
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL!;
  const imageUrl = getImageUrl(car.thumbnail, directusUrl);
  const brandName = car.brand_id?.name || '—';
  const seriesName = car.series_id?.seriesname || '—';

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Image Section */}
      <Link href={`/cars/${car.infoid}`} className="block relative h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={`${brandName} ${seriesName}`}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={process.env.NODE_ENV === 'development'}
          priority
        />
      </Link>

      {/* Content Section */}
      <div className="p-4">
        {/* Car Name */}
        <div className="mb-2">
          <h2
            className="text-lg font-bold text-gray-900 truncate max-w-[250px]"
            title={car.carname}
          >
            {car.carname}
          </h2>
        </div>
        {/* Title and Year */}
        <div className="flex justify-between items-start mb-3 mt-2">
          <div className="space-y-1">
            <div className="text-base text-gray-700 font-medium">
              Серия: {seriesName}
            </div>
            <div className="text-base text-gray-700 font-medium">
              Бренд: {brandName}
            </div>
          </div>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {car.year}
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-xl font-bold text-blue-600 flex items-center gap-1">
            <span className="text-base">$</span>{formatNumberRu(car.price)}
          </p>
        </div>

        {/* Parameters Grid */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{formatNumberRu(car.mileage)} км</span>
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