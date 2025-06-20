'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { directusAPI } from '@/lib/directus';
import { Car } from '@/types/directus';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import CarListItem from '@/components/CarListItem';
import InfoBlocks from '@/components/InfoBlocks';
import FeaturedCarsSlider from '@/components/FeaturedCarsSlider';

interface Filters {
  brand: string;
  model: string;
  year: string;
  mileage: string;
  price: string;
}

interface FilterOptions {
  brands: string[];
  models: string[];
  years: number[];
  mileage: number[];
  price: number[];
}

interface TopBrand {
  brand: string;
  count: number;
}

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
if (!directusUrl) {
  throw new Error('NEXT_PUBLIC_DIRECTUS_URL is not defined');
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage] = useState(12);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'+' | '-'>('+');
  const [showFilters, setShowFilters] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [topBrands, setTopBrands] = useState<TopBrand[]>([]);
  const [filters, setFilters] = useState<Filters>({
    brand: '',
    model: '',
    year: '',
    mileage: '',
    price: ''
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    brands: [],
    models: [],
    years: [],
    mileage: [],
    price: []
  });
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadData();
      loadTopBrands();
      loadFeaturedCars();
    }
  }, [mounted, currentPage, sortField, sortDirection, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, any> = {
        limit: itemsPerPage,
        page: currentPage,
        sort: sortField ? `${sortDirection}${sortField}` : undefined,
        meta: 'total_count,filter_count'
      };

      const apiFilters: Record<string, any> = {};
      
      if (filters.brand) {
        apiFilters['brand'] = { _eq: filters.brand };
      }
      
      if (filters.model) {
        apiFilters['model'] = { _eq: filters.model };
      }
      
      if (filters.year) {
        const year = Number(filters.year);
        if (!isNaN(year) && Number.isInteger(year)) {
          apiFilters['year'] = { _eq: year };
        }
      }
      
      if (filters.mileage) {
        const mileage = Number(filters.mileage);
        if (!isNaN(mileage) && Number.isInteger(mileage)) {
          apiFilters['mileage'] = { _lte: mileage };
        }
      }
      
      if (filters.price) {
        const price = Number(filters.price);
        if (!isNaN(price) && Number.isInteger(price)) {
          apiFilters['price'] = { _lte: price };
        }
      }

      if (Object.keys(apiFilters).length > 0) {
        params.filter = apiFilters;
      }
      
      const response = await directusAPI.getCars(params);
      setCars(response.data);
      setTotalCount(response.meta?.total_count || 0);

      // Обновляем опции фильтров
      if (response.data.length > 0) {
        const brands = [...new Set(response.data.map((car: Car) => car.brand))].sort();
        const models = [...new Set(response.data.map((car: Car) => car.model))].sort();
        const years = [...new Set(response.data.map((car: Car) => car.year))].sort((a: number, b: number) => b - a);
        const maxMileage = Math.max(...response.data.map((car: Car) => car.mileage));
        const maxPrice = Math.max(...response.data.map((car: Car) => car.price));

        setFilterOptions({
          brands,
          models,
          years,
          mileage: [50000, 100000, 150000, 200000, maxMileage],
          price: [20000, 30000, 40000, 50000, maxPrice]
        });
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  const loadTopBrands = async () => {
    try {
      const response = await directusAPI.getCars({
        limit: 1000
      });

      if (response.data.length > 0) {
        const brandCounts = response.data.reduce((acc: Record<string, number>, car: Car) => {
          acc[car.brand] = (acc[car.brand] || 0) + 1;
          return acc;
        }, {});

        const sortedBrands = Object.entries(brandCounts)
          .map(([brand, count]) => ({ brand, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setTopBrands(sortedBrands);
      }
    } catch (err) {
      console.error('Error fetching top brands:', err);
    }
  };

  const loadFeaturedCars = async () => {
    try {
      const response = await directusAPI.getCars({
        limit: 1000
      });

      if (response.data.length > 0) {
        // Get 3 random cars
        const shuffled = [...response.data].sort(() => 0.5 - Math.random());
        setFeaturedCars(shuffled.slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching featured cars:', err);
    }
  };

  const handleFilterChange = (field: keyof Filters, value: string) => {
    if (['year', 'mileage', 'price'].includes(field)) {
      const numValue = Number(value);
      if (value === '' || (!isNaN(numValue) && Number.isInteger(numValue))) {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
      }
    } else {
      setFilters(prev => ({ ...prev, [field]: value }));
      setCurrentPage(1);
    }
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      model: '',
      year: '',
      mileage: '',
      price: ''
    });
    setCurrentPage(1);
  };

  const renderPagination = () => {
    return (
      <>
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-white border border-gray-300 disabled:opacity-50"
        >
          Назад
        </button>
        <span className="px-3 py-1">
          Страница {currentPage} из {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-white border border-gray-300 disabled:opacity-50"
        >
          Вперед
        </button>
      </>
    );
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Featured Cars Slider */}
        {featuredCars.length > 0 && (
          <div className="mt-2">
            <FeaturedCarsSlider cars={featuredCars} />
          </div>
        )}

        <div className="py-8">
          {/* Info Blocks */}
          <InfoBlocks />

          {/* Features Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <button
              onClick={() => setShowFeatures(!showFeatures)}
              className="flex items-center gap-2 w-full text-left"
            >
              <h2 className="text-2xl font-bold">Преимущества</h2>
              {showFeatures ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>

            {showFeatures && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div className="p-4 border border-gray-100 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Техническая проверка</h3>
                  <p className="text-sm text-gray-600">Техническая проверка и проверка продавца проводятся через наших партнёров в Китае.</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Безопасная сделка</h3>
                  <p className="text-sm text-gray-600">Сделка оформляется через представителей в Китае и Беларуси.</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Финансовые гарантии</h3>
                  <p className="text-sm text-gray-600">Мы предоставляем финансовые гарантии на доставку автомобиля.</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Доставка</h3>
                  <p className="text-sm text-gray-600">Доставка осуществляется в Беларусь, Польшу, страны Балтии, Россию и другие страны СНГ.</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Поддержка</h3>
                  <p className="text-sm text-gray-600">Менеджеры бесплатно помогают подобрать подходящий автомобиль и сопровождают на всех этапах.</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Дополнительно</h3>
                  <p className="text-sm text-gray-600">В стоимость не входят доставка и таможенные сборы.</p>
                </div>
              </div>
            )}
          </section>

          {/* Top Brands Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Популярные марки</h2>
                <Link 
                  href="/cars/brand"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Все марки →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {topBrands.map(({ brand, count }) => (
                  <Link
                    key={brand}
                    href={`/cars/brand/${encodeURIComponent(brand)}`}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="font-semibold text-lg mb-1">{brand}</h3>
                    <p className="text-sm text-gray-600">{count} автомобилей</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Filters */}
          <div className="mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              Фильтры
              {showFilters ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>

            {showFilters && (
              <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Фильтры</h2>
                  <button
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Марка</label>
                    <select
                      value={filters.brand}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Все марки</option>
                      {filterOptions.brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Модель</label>
                    <select
                      value={filters.model}
                      onChange={(e) => handleFilterChange('model', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Все модели</option>
                      {filterOptions.models.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Год выпуска</label>
                    <select
                      value={filters.year}
                      onChange={(e) => handleFilterChange('year', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Любой год</option>
                      {filterOptions.years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Пробег до</label>
                    <select
                      value={filters.mileage}
                      onChange={(e) => handleFilterChange('mileage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Любой пробег</option>
                      {filterOptions.mileage.map((mileage) => (
                        <option key={mileage} value={mileage}>
                          {mileage.toLocaleString()} км
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Цена до</label>
                    <select
                      value={filters.price}
                      onChange={(e) => handleFilterChange('price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Любая цена</option>
                      {filterOptions.price.map((price) => (
                        <option key={price} value={price}>
                          ${price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cars Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cars.map((car) => (
                  <CarListItem key={car.id} car={car} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  {renderPagination()}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
