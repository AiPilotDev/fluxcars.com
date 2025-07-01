'use client';
import { Car as DirectusCar } from '@/types/directus';
import CarListItem from '@/components/CarListItem';
import { fetchBrands } from '@/lib/directus';
import { useEffect, useState } from 'react';

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
}

interface SimilarCarsProps {
  currentCar: CarPageData;
  cars: DirectusCar[];
}

export default function SimilarCars({ currentCar, cars }: SimilarCarsProps) {
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    fetchBrands().then(res => setBrands(res.data)).catch(() => setBrands([]));
  }, []);
  // Filter out the current car and get similar cars based on brand and model
  const similarCars = cars
    .filter(car => car.id !== currentCar.id && (car.brand === currentCar.brand || car.model === currentCar.model))
    .slice(0, 4);

  if (similarCars.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6" suppressHydrationWarning>Похожие автомобили</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarCars.map((car) => (
            <CarListItem key={car.id} car={car} brands={brands} />
          ))}
        </div>
      </div>
    </div>
  );
} 