'use client';
import { Car as DirectusCar } from '@/types/directus';
import CarListItem from '@/components/CarListItem';

interface CarPageData {
  id: number;
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
  const currentBrandIdStr = String(currentCar.brand);
  const similarCars = cars
    .filter(car => {
      const carBrandIdStr = String(car.brand_id.id);
      return car.id !== currentCar.id && (carBrandIdStr === currentBrandIdStr || car.model === currentCar.model);
    })
    .slice(0, 4);

  if (similarCars.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6" suppressHydrationWarning>Похожие автомобили</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {cars.length === 0 ? (
            <div className="col-span-4 text-gray-500">Нет похожих авто</div>
          ) : (
            cars.map((car) => (
              <CarListItem key={car.id} car={car} />
            ))
          )}
        </div>
      </div>
    </div>
  );
} 