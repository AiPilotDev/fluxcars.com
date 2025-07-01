'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Car, ArrowUpDown, X, Search } from 'lucide-react';
import { Car as CarType, Brand } from '@/types/directus';
import { directusAPI, fetchBrands } from '@/lib/directus';
import CarListItem from '@/components/CarListItem';
import { formatError } from '@/utils/formatError';
import { formatPrice } from '@/utils/formatPrice';
import { useSearchParams } from 'next/navigation';

const ITEMS_PER_PAGE = 16;

type SortField = 'year' | 'mileage' | 'price' | 'date_created';
type SortOrder = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  order: SortOrder;
}

interface Filters {
  brand: string;
  series_id: string;
  year: string;
  mileage: string;
  price: string;
  search: string;
  color: string;
  engineVolume: string;
  priceRange: [number, number];
  mileageRange: [number, number];
}

interface FilterOptions {
  brands: Brand[];
  seriesList: { id: string; name: string }[];
  years: number[];
  mileageRanges: number[];
  priceRanges: number[];
  colors: string[];
  engineVolumes: number[];
}

export default function CarsClient() {
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'date_created', order: 'desc' });
  const [filters, setFilters] = useState<Filters>({
    brand: '',
    series_id: '',
    year: '',
    mileage: '',
    price: '',
    search: '',
    color: '',
    engineVolume: '',
    priceRange: [0, 100000],
    mileageRange: [0, 200000]
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    brands: [],
    seriesList: [],
    years: [],
    mileageRanges: [],
    priceRanges: [],
    colors: [],
    engineVolumes: []
  });
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  if (!directusUrl) {
    throw new Error('NEXT_PUBLIC_DIRECTUS_URL is not defined');
  }

  const searchParams = useSearchParams();

  useEffect(() => {
    // Считываем параметры из URL и применяем к фильтрам
    const brand = searchParams?.get('brand') || '';
    const series_id = searchParams?.get('series_id') || '';
    const year = searchParams?.get('year') || '';
    const search = searchParams?.get('search') || '';
    const color = searchParams?.get('color') || '';
    const engineVolume = searchParams?.get('engineVolume') || '';
    const price = searchParams?.get('price') || '';
    const mileage = searchParams?.get('mileage') || '';
    setFilters(prev => ({
      ...prev,
      brand,
      series_id,
      year,
      search,
      color,
      engineVolume,
      price,
      mileage
    }));
  }, [searchParams]);

  useEffect(() => {
    const fetchAllBrands = async () => {
      try {
        const res = await fetchBrands();
        setFilterOptions(prev => ({ ...prev, brands: res.data }));
      } catch {
        // ignore
      }
    };
    fetchAllBrands();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params: Record<string, unknown> = {
          limit: ITEMS_PER_PAGE,
          page: currentPage,
          sort: `${sortConfig.order === 'desc' ? '-' : ''}${sortConfig.field}`,
          meta: 'total_count,filter_count'
        };
        const apiFilters: Record<string, unknown> = {};
        const searchValue = filters.search?.trim();
        if (searchValue) {
          const words = searchValue.split(/\s+/).filter(Boolean);
          if (words.length > 0) {
            apiFilters['_and'] = words.map(word => ({
              _or: [
                { brand: { _icontains: word } },
                { carname: { _icontains: word } }
              ]
            }));
          }
        }
        if (filters.brand) apiFilters['brand_id'] = { _eq: filters.brand };
        if (filters.series_id) apiFilters['series_id'] = { _eq: filters.series_id };
        if (filters.color) apiFilters['color'] = { _eq: filters.color };
        if (filters.engineVolume) {
          const engineVolume = Number(filters.engineVolume);
          if (!isNaN(engineVolume)) apiFilters['engine_volume'] = { _eq: engineVolume };
        }
        if (filters.year) {
          const year = Number(filters.year);
          if (!isNaN(year) && Number.isInteger(year)) apiFilters['year'] = { _eq: year };
        }
        if (filters.mileage) {
          const mileage = Number(filters.mileage);
          if (!isNaN(mileage) && Number.isInteger(mileage)) apiFilters['mileage'] = { _lte: mileage };
        }
        if (filters.price) {
          const price = Number(filters.price);
          if (!isNaN(price) && Number.isInteger(price)) apiFilters['price'] = { _lte: price };
        }
        if (Object.keys(apiFilters).length > 0) params.filter = apiFilters;
        const response = await directusAPI.getCars(params);
        setCars(response.data);
        setTotalCount(response.meta?.total_count || 0);
      } catch (err) {
        setError(formatError(err));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPage, sortConfig, filters]);

  const handleFilterChange = async (field: keyof Filters, value: string) => {
    if (field === 'brand') {
      setFilters(prev => ({ ...prev, brand: value, series_id: '' }));
      if (value) {
        try {
          // 1. Получаем все Cars с этим brand_id
          const carsRes = await fetch(`https://api.fluxcars.com/items/Cars?fields=series_id,brand_id&limit=1000&filter[brand_id][_eq]=${encodeURIComponent(value)}`);
          const carsData = await carsRes.json();
          const uniqueSeriesIds = Array.from(new Set((carsData.data || []).map((c: { series_id: string }) => c.series_id).filter(Boolean)));
          // 2. Получаем series по этим id
          let seriesList: { id: string; name: string }[] = [];
          if (uniqueSeriesIds.length > 0) {
            const filterStr = `filter[id][_in]=${uniqueSeriesIds.join(',')}`;
            const seriesRes = await fetch(`https://api.fluxcars.com/items/series?fields=id,seriesname&limit=1000&${filterStr}`);
            const seriesData = await seriesRes.json();
            seriesList = (seriesData.data || []).map((s: { id: string; seriesname: string }) => ({ id: s.id, name: s.seriesname }));
          }
          setFilterOptions(prev => ({ ...prev, seriesList }));
        } catch {
          setFilterOptions(prev => ({ ...prev, seriesList: [] }));
        }
      } else {
        setFilterOptions(prev => ({ ...prev, seriesList: [] }));
      }
    } else if (["year", "mileage", "price"].includes(field)) {
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

  const handlePriceRangeChange = (value: [number, number]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: value,
      price: value[1].toString()
    }));
    setCurrentPage(1);
  };

  const handleMileageRangeChange = (value: [number, number]) => {
    setFilters(prev => ({
      ...prev,
      mileageRange: value,
      mileage: value[1].toString()
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      series_id: '',
      year: '',
      mileage: '',
      price: '',
      search: '',
      color: '',
      engineVolume: '',
      priceRange: [filterOptions.priceRanges[0], filterOptions.priceRanges[1]],
      mileageRange: [filterOptions.mileageRanges[0], filterOptions.mileageRanges[1]]
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    pages.push(
      <button key="prev" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={20} /></button>
    );
    if (startPage > 1) {
      pages.push(
        <button key={1} onClick={() => handlePageChange(1)} className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">1</button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="flex items-center justify-center w-10 h-10 text-gray-500">...</span>);
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} onClick={() => handlePageChange(i)} className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${i === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>{i}</button>
      );
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="flex items-center justify-center w-10 h-10 text-gray-500">...</span>);
      }
      pages.push(
        <button key={totalPages} onClick={() => handlePageChange(totalPages)} className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">{totalPages}</button>
      );
    }
    pages.push(
      <button key="next" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRight size={20} /></button>
    );
    return pages;
  };

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1);
  };

  const fetchFilterOptions = async () => {
    try {
      const result = await directusAPI.getCars({ limit: 1000, sort: 'brand_id' });
      if (!result?.data) return;
      const years = [...new Set(result.data.map(car => car.year))].sort((a, b) => b - a);
      const colors = [...new Set(result.data.map(car => car.color).filter((color): color is string => Boolean(color)))].sort();
      const engineVolumes = [...new Set(result.data.map(car => car.engine_volume).filter((volume): volume is number => typeof volume === 'number'))].sort((a, b) => a - b);
      const maxMileage = Math.max(...result.data.map(car => car.mileage));
      const minMileage = Math.min(...result.data.map(car => car.mileage));
      const maxPrice = Math.max(...result.data.map(car => car.price));
      const minPrice = Math.min(...result.data.map(car => car.price));
      setFilterOptions(prev => ({
        ...prev,
        seriesList: [],
        years,
        mileageRanges: [minMileage, maxMileage],
        priceRanges: [minPrice, maxPrice],
        colors,
        engineVolumes
      }));
      setFilters(prev => ({
        ...prev,
        priceRange: [minPrice, maxPrice],
        mileageRange: [minMileage, maxMileage]
      }));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchSearchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      return;
    }
    try {
      const response = await directusAPI.getCars({
        limit: 5,
        filter: {
          _or: [
            { brand: { _icontains: query } },
            { carname: { _icontains: query } }
          ]
        }
      });
      const suggestions = new Set<string>();
      response.data.forEach(car => {
        if (car.brand.toLowerCase().includes(query.toLowerCase())) suggestions.add(car.brand);
        if (car.carname?.toLowerCase().includes(query.toLowerCase())) suggestions.add(car.carname);
      });
      setSearchSuggestions(Array.from(suggestions));
    } catch {
      // ignore
    }
  };

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    fetchSearchSuggestions(value);
    setShowSuggestions(true);
    setCurrentPage(1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setFilters(prev => ({ ...prev, search: suggestion }));
    setShowSuggestions(false);
    setCurrentPage(1);
  };

  if (loading && cars.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка автомобилей...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <Car size={48} className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ошибка загрузки</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Каталог автомобилей</h1>
          <p className="text-gray-600">
            {totalCount > 0 ? (
              <>Найдено {totalCount} автомобилей • Страница {currentPage} из {totalPages}</>
            ) : (
              <>Загрузка данных...</>
            )}
          </p>
        </div>
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="relative">
            <label htmlFor="car-search" className="block text-sm font-medium text-gray-700 mb-1">Поиск</label>
            <div className="relative">
              <input
                id="car-search"
                name="car-search"
                type="text"
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Поиск по бренду, модели или названию..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Бренд</label>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Все бренды</option>
                {filterOptions.brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Серия</label>
              <select
                value={filters.series_id}
                onChange={(e) => handleFilterChange('series_id', e.target.value)}
                disabled={!filters.brand}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!filters.brand ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">Все серии</option>
                {filterOptions.seriesList.map((series) => (
                  <option key={series.id} value={series.id}>{series.name}</option>
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
                  <option key={color} value={color}>{color}</option>
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
                  <option key={volume} value={volume}>{volume} л</option>
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
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Пробег</label>
              <div className="px-2">
                <input
                  type="range"
                  min={filterOptions.mileageRanges[0]}
                  max={filterOptions.mileageRanges[1]}
                  value={filters.mileageRange[1]}
                  onChange={(e) => handleMileageRangeChange([filters.mileageRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{filters.mileageRange[0].toLocaleString()} км</span>
                  <span>{filters.mileageRange[1].toLocaleString()} км</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Цена</label>
              <div className="px-2">
                <input
                  type="range"
                  min={filterOptions.priceRanges[0]}
                  max={filterOptions.priceRanges[1]}
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceRangeChange([filterOptions.priceRanges[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{formatPrice(filters.priceRange[0])}</span>
                  <span>{formatPrice(filters.priceRange[1])}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <X size={16} />
              Сбросить фильтры
            </button>
          </div>
        </div>
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
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Нет автомобилей</h3>
              <p className="text-gray-600 mb-4">Нет автомобилей, подходящих по выбранным параметрам</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cars.map((car) => (
                <CarListItem key={car.id} car={car} brands={filterOptions.brands} seriesList={filterOptions.seriesList} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                {renderPagination()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 