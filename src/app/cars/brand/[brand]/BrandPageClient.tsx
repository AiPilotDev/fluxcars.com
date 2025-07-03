'use client';

import { useState, useEffect } from 'react';
import CarListItem from '@/components/CarListItem';
import Pagination from '@/components/Pagination';
import { Car } from '@/types/directus';
import Link from 'next/link';
import { ArrowUpDown } from 'lucide-react';
import { formatError } from '@/utils/formatError';
import { fetchBrands } from '@/lib/directus';

const ITEMS_PER_PAGE = 15;

type SortField = 'year' | 'mileage' | 'price' | 'date_created';
type SortOrder = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  order: SortOrder;
}

interface Filters {
  year: string;
  mileage: string;
  price: string;
  color: string;
  engineVolume: string;
  priceRange: [number, number];
  mileageRange: [number, number];
}

interface FilterOptions {
  years: number[];
  mileageRanges: number[];
  priceRanges: number[];
  colors: string[];
  engineVolumes: number[];
}

interface BrandPageClientProps {
  initialBrand: string;
  initialBrandId: string;
  initialPage: number;
  initialSortField: SortField;
  initialSortOrder: SortOrder;
  initialSeriesList: { id: number; name: string }[];
}

async function getCarsByBrand(
  brandId: string, 
  page: number = 1, 
  sortField: SortField = 'date_created', 
  sortOrder: SortOrder = 'desc',
  filters: Partial<Filters> = {}
) {
  if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) {
    console.error('NEXT_PUBLIC_DIRECTUS_URL is not defined');
    return { cars: [], total: 0 };
  }

  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const url = new URL(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/Cars`);
    
    // Add brand_id filter
    url.searchParams.append('filter[brand_id][_eq]', brandId);
    
    // Add other filters
    if (filters.year) {
      const year = Number(filters.year);
      if (!isNaN(year)) {
        url.searchParams.append('filter[year][_eq]', year.toString());
      }
    }
    
    if (filters.color) {
      url.searchParams.append('filter[color][_eq]', filters.color);
    }
    
    if (filters.engineVolume) {
      const engineVolume = Number(filters.engineVolume);
      if (!isNaN(engineVolume)) {
        url.searchParams.append('filter[engine_volume][_eq]', engineVolume.toString());
      }
    }
    
    if (filters.priceRange &&
      Array.isArray(filters.priceRange) &&
      filters.priceRange.length === 2 &&
      isFinite(filters.priceRange[0]) && isFinite(filters.priceRange[1]) &&
      !isNaN(filters.priceRange[0]) && !isNaN(filters.priceRange[1]) &&
      filters.priceRange[0] !== filters.priceRange[1]) {
      url.searchParams.append('filter[price][_gte]', filters.priceRange[0].toString());
      url.searchParams.append('filter[price][_lte]', filters.priceRange[1].toString());
    }
    
    if (filters.mileageRange &&
      Array.isArray(filters.mileageRange) &&
      filters.mileageRange.length === 2 &&
      isFinite(filters.mileageRange[0]) && isFinite(filters.mileageRange[1]) &&
      !isNaN(filters.mileageRange[0]) && !isNaN(filters.mileageRange[1]) &&
      filters.mileageRange[0] !== filters.mileageRange[1]) {
      url.searchParams.append('filter[mileage][_gte]', filters.mileageRange[0].toString());
      url.searchParams.append('filter[mileage][_lte]', filters.mileageRange[1].toString());
    }
    
    url.searchParams.append('fields', '*,images.*');
    url.searchParams.append('limit', ITEMS_PER_PAGE.toString());
    url.searchParams.append('offset', offset.toString());
    url.searchParams.append('sort', `${sortOrder === 'desc' ? '-' : ''}${sortField}`);
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

export default function BrandPageClient({
  initialBrand,
  initialBrandId,
  initialPage,
  initialSortField,
  initialSortOrder,
  initialSeriesList,
}: BrandPageClientProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    field: initialSortField,
    order: initialSortOrder
  });
  const [filters, setFilters] = useState<Filters>({
    year: '',
    mileage: '',
    price: '',
    color: '',
    engineVolume: '',
    priceRange: [0, 100000],
    mileageRange: [0, 200000]
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    years: [],
    mileageRanges: [],
    priceRanges: [],
    colors: [],
    engineVolumes: []
  });
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [brandName] = useState(initialBrand);
  const [brandId] = useState(initialBrandId);
  const [seriesList] = useState<{ id: number; name: string }[]>(initialSeriesList);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Load cars when parameters change
  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        if (!brandId) {
          setCars([]);
          setTotal(0);
          return;
        }
        const result = await getCarsByBrand(brandId, currentPage, sortConfig.field, sortConfig.order, filters);
        setCars(result.cars);
        setTotal(result.total);
      } catch (err) {
        setError(formatError(err));
        console.error(formatError(err));
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, [brandId, currentPage, sortConfig, filters]);

  useEffect(() => {
    fetchBrands().then(res => {
      setBrands(res.data.map(b => ({ id: String(b.id), name: b.name })));
    });
  }, []);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
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
      year: '',
      mileage: '',
      price: '',
      color: '',
      engineVolume: '',
      priceRange: [filterOptions.priceRanges[0], filterOptions.priceRanges[1]],
      mileageRange: [filterOptions.mileageRanges[0], filterOptions.mileageRanges[1]]
    });
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/Cars?filter[brand_id][_eq]=${brandId}&fields=year,color,engine_volume,price,mileage`);
        const data = await response.json();
        
        const years = Array.from(new Set(data.data.map((car: Car) => car.year)))
          .filter((year): year is number => typeof year === 'number')
          .sort((a, b) => b - a);
        
        const colors = Array.from(new Set(data.data.map((car: Car) => car.color)))
          .filter((color): color is string => typeof color === 'string');
        
        const engineVolumes = Array.from(new Set(data.data.map((car: Car) => car.engine_volume)))
          .filter((volume): volume is number => typeof volume === 'number')
          .sort((a, b) => a - b);
        
        const prices = data.data
          .map((car: Car) => car.price)
          .filter((price: unknown): price is number => typeof price === 'number');
        
        const mileages = data.data
          .map((car: Car) => car.mileage)
          .filter((mileage: unknown): mileage is number => typeof mileage === 'number');
        
        const minPrice = prices.length ? Math.min(...prices) : undefined;
        const maxPrice = prices.length ? Math.max(...prices) : undefined;
        const minMileage = mileages.length ? Math.min(...mileages) : undefined;
        const maxMileage = mileages.length ? Math.max(...mileages) : undefined;

        setFilterOptions({
          years,
          mileageRanges: [minMileage ?? 0, maxMileage ?? 0],
          priceRanges: [minPrice ?? 0, maxPrice ?? 0],
          colors,
          engineVolumes
        });

        setFilters(prev => ({
          ...prev,
          priceRange: [minPrice ?? 0, maxPrice ?? 0],
          mileageRange: [minMileage ?? 0, maxMileage ?? 0]
        }));
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    };

    fetchFilterOptions();
  }, [brandId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Автомобили {brandName}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Car List */}
          <div className="lg:col-span-2 space-y-8">
            {/* Filters */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Год</label>
                  <select
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Все годы</option>
                    {filterOptions.years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Цвет</label>
                  <select
                    value={filters.color}
                    onChange={(e) => handleFilterChange('color', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Все цвета</option>
                    {filterOptions.colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Объем двигателя</label>
                  <select
                    value={filters.engineVolume}
                    onChange={(e) => handleFilterChange('engineVolume', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Любой объем</option>
                    {filterOptions.engineVolumes.map((volume) => (
                      <option key={volume} value={volume}>
                        {volume} л
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              </div>
            </div>

            {/* Sorting Controls */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-wrap gap-2">
                {([
                  { field: 'date_created', label: 'Новые' },
                  { field: 'year', label: 'Год' },
                  { field: 'mileage', label: 'Пробег' },
                  { field: 'price', label: 'Цена' }
                ] as const).map(({ field, label }) => (
                  <button
                    key={field}
                    onClick={() => handleSort(field)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${sortConfig.field === field
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {label}
                    {sortConfig.field === field && (
                      <ArrowUpDown size={16} className={sortConfig.order === 'desc' ? 'rotate-180' : ''} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {!loading ? (
              error ? (
                <div className="text-center py-12 text-red-600">{error}</div>
              ) : cars.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-white rounded-lg shadow-sm p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Авто не существует</h3>
                    <p className="text-gray-600 mb-4">По выбранным критериям не найдено автомобилей</p>
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Сбросить фильтры
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {cars.length === 0 ? (
                      <div className="col-span-4 text-gray-500">Нет авто</div>
                    ) : (
                      cars.map((car) => {
                        // Гарантируем, что brand_id и series_id всегда объект
                        let brandObj = car.brand_id;
                        if (typeof car.brand_id === 'number') {
                          const foundBrand = brands.find(b => String(b.id) === String(car.brand_id));
                          brandObj = { id: car.brand_id, name: foundBrand?.name || '—' };
                        }
                        let seriesObj = car.series_id;
                        if (typeof car.series_id === 'number') {
                          const foundSeries = seriesList.find(s => String(s.id) === String(car.series_id));
                          seriesObj = { id: car.series_id, seriesname: foundSeries?.name || '—' };
                        }
                        return (
                          <CarListItem key={car.id} car={{ ...car, brand_id: brandObj, series_id: seriesObj }} />
                        );
                      })
                    )}
                  </div>

                  {totalPages > 1 && (
                    <Pagination totalPages={totalPages} currentPage={currentPage} />
                  )}
                </>
              )
            ) : (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            )}
          </div>

          {/* Right Column - Models */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">
                      Модели
                    </h3>
                    {loading ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {seriesList.length === 0 ? (
                          <div className="col-span-2 text-gray-400 text-sm">Нет моделей</div>
                        ) : (
                          seriesList.map(series => (
                            <Link
                              key={series.id}
                              href={`/cars/model/${encodeURIComponent(series.name)}`}
                              className="block text-blue-600 hover:text-blue-800 transition-colors bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                            >
                              {series.name}
                            </Link>
                          ))
                        )}
                      </div>
                    )}
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