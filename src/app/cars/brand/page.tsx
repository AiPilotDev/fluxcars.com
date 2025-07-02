import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchBrands } from '@/lib/directus';

export default async function BrandsPage() {
  const brandsRes = await fetchBrands();
  const brands = brandsRes.data;
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
            Найдено {brands.length} марок
          </p>
        </div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/cars/brand/${encodeURIComponent(brand.name)}`}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                {brand.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 