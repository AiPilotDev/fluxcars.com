import Image from 'next/image';
import Link from 'next/link';
import { Car as CarType } from '@/types/directus';
import { formatPrice } from '@/lib/directus';

interface CarCardProps {
  car: CarType;
}

export default function CarCard({ car }: CarCardProps) {
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  if (!directusUrl) {
    throw new Error('NEXT_PUBLIC_DIRECTUS_URL is not defined');
  }

  const getImageUrl = (thumbnail: string | null): string => {
    if (!thumbnail) return '/images/car-placeholder.jpg';
    
    if (thumbnail.startsWith('http')) {
      return thumbnail;
    }
    
    return `${directusUrl}/assets/${thumbnail}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <Image
          src={getImageUrl(car.thumbnail)}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover"
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
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-semibold text-gray-900">
            {car.brand} {car.model}
          </h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {car.year}
          </span>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{car.mileage.toLocaleString()} км</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Проверен</span>
          </div>
          <p className="text-base font-semibold text-blue-600">
            {formatPrice(car.price)}
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <Link 
              href={`/cars/${car.infoid}`} 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Подробнее
            </Link>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
              Купить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 