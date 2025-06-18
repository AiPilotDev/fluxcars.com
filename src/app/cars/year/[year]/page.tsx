import { notFound } from 'next/navigation';
import CarListItem from '@/components/CarListItem';
import Pagination from '@/components/Pagination';
import { Car } from '@/types/directus';
import Link from 'next/link';
import { Metadata } from 'next';

const ITEMS_PER_PAGE = 15;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;

  return {
    title: `Купить авто ${year} года в Беларуси`,
    description: `Купить автомобиль ${year} года в Беларуси. Большой выбор новых и подержанных авто ${year} года выпуска с гарантией. Цены от официальных дилеров и частных продавцов. Авто ${year} года в Минске, Гомеле, Бресте и других городах Беларуси.`,
    keywords: `${year} год, купить авто ${year}, автомобили ${year} года, авто ${year} года Беларусь, ${year} год Минск`,
  };
}

async function getCarsByYear(year: string, page: number = 1) {
  if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) {
    console.error('NEXT_PUBLIC_DIRECTUS_URL is not defined');
    return { cars: [], total: 0 };
  }

  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const url = new URL(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/Cars`);
    url.searchParams.append('filter[year][_eq]', year);
    url.searchParams.append('fields', '*,images.*');
    url.searchParams.append('limit', ITEMS_PER_PAGE.toString());
    url.searchParams.append('offset', offset.toString());
    url.searchParams.append('sort', '-date_created');
    url.searchParams.append('meta', 'filter_count');
    
    const response = await fetch(url.toString(), {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch cars:', response.status, response.statusText);
      return { cars: [], total: 0 };
    }

    const data = await response.json();
    return {
      cars: data.data as Car[],
      total: data.meta?.filter_count || 0
    };
  } catch (error) {
    console.error('Error fetching cars:', error);
    return { cars: [], total: 0 };
  }
}

export default async function YearPage({
  params,
  searchParams,
}: {
  params: Promise<{ year: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { year } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  
  const { cars, total } = await getCarsByYear(year, currentPage);
  
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Автомобили {year} года
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Car List */}
          <div className="lg:col-span-2 space-y-8">
            {cars.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Авто не существует</h3>
                  <p className="text-gray-600 mb-4">По выбранным критериям не найдено автомобилей</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {cars.map((car) => (
                    <CarListItem key={car.infoid} car={car} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination totalPages={totalPages} currentPage={currentPage} />
                )}
              </>
            )}
          </div>

          {/* Right Column - Filters */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Марки</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from(new Set(cars.map(car => car.brand))).map(brand => (
                        <Link
                          key={brand}
                          href={`/cars/brand/${encodeURIComponent(brand)}`}
                          className="block text-blue-600 hover:text-blue-800 transition-colors bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          {brand}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Модели</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from(new Set(cars.map(car => car.model))).map(model => (
                        <Link
                          key={model}
                          href={`/cars/model/${encodeURIComponent(model)}`}
                          className="block text-blue-600 hover:text-blue-800 transition-colors bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          {model}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 