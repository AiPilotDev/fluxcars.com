'use client';

import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import { useState, useEffect } from 'react';
import { getImageUrl } from '@/utils/getImageUrl';

interface Car {
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
  images: {
    id: number;
    url: string;
  }[];
}

export default function CarGallery({ car }: { car: Car }) {
  const [index, setIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    import('yet-another-react-lightbox/styles.css');
  }, []);

  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL!;
  const slides = car.images?.map(image => ({
    src: getImageUrl(image.url, directusUrl),
    alt: `${car.carname} - Image`
  })) || [];

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {car.images?.map((image, idx) => (
            <div 
              key={image.id} 
              className="relative aspect-video cursor-pointer transform transition-transform hover:scale-105"
            >
              <Image
                src={getImageUrl(image.url, directusUrl)}
                alt={`${car.carname} - Image ${idx + 1}`}
                fill
                className="object-cover rounded-lg shadow-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {car.images?.map((image, idx) => (
          <div 
            key={image.id} 
            className="relative aspect-video cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => setIndex(idx)}
          >
            <Image
              src={getImageUrl(image.url, directusUrl)}
              alt={`${car.carname} - Image ${idx + 1}`}
              fill
              className="object-cover rounded-lg shadow-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>

      <Lightbox
        slides={slides}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
      />
    </div>
  );
} 