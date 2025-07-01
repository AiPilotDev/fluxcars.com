import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Brand } from '@/types/directus';

async function getAllBrands(): Promise<Brand[]> {
  if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) {
    console.error('NEXT_PUBLIC_DIRECTUS_URL is not defined');
    return [];
  }
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/brands`);
    url.searchParams.append('fields', 'id,name');
    url.searchParams.append('sort', 'name');
    url.searchParams.append('limit', '100');
    const response = await fetch(url.toString(), { next: { revalidate: 60 }, headers: { 'Content-Type': 'application/json' } });
    if (!response.ok) {
      console.error('Failed to fetch brands:', response.status, response.statusText);
      return [];
    }
    const data = await response.json();
    return data.data as Brand[];
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

export default async function BrandsPage() {
  const brands = await getAllBrands();
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