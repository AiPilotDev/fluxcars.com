import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Car, DirectusResponse } from '@/types/directus';
import { formatError } from '@/utils/formatError';

interface BrandsResponse {
  brands: string[];
  total: number;
}

async function getAllBrands(): Promise<BrandsResponse> {
  if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) {
    console.error('NEXT_PUBLIC_DIRECTUS_URL is not defined');
    return { brands: [], total: 0 };
  }

  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/Cars`);
    url.searchParams.append('fields', 'brand');
    url.searchParams.append('limit', '1000');
    url.searchParams.append('sort', 'brand');
    
    const response = await fetch(url.toString(), { next: { revalidate: 60 }, headers: { 'Content-Type': 'application/json' } });
    
    if (!response.ok) {
      console.error('Failed to fetch brands:', response.status, response.statusText);
      return { brands: [], total: 0 };
    }

    const data = await response.json() as DirectusResponse<Car>;
    const uniqueBrands = [...new Set(data.data.map(car => car.brand))].sort();
    
    return {
      brands: uniqueBrands,
      total: uniqueBrands.length
    };
  } catch (error) {
    console.error('Error fetching brands:', formatError(error));
    return { brands: [], total: 0 };
  }
}

export default async function BrandsPage() {
  const { brands, total } = await getAllBrands();
  
  if (brands.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Все марки автомобилей
          </h1>
          <p className="text-gray-300 text-lg">
            Найдено {total} марок
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {brands.map((brand: string) => (
            <Link
              key={brand}
              href={`/cars/brand/${encodeURIComponent(brand)}`}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                {brand}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 