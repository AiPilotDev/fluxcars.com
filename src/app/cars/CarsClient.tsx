'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import CarListItem from '@/components/CarListItem';
import { Car as CarType, Brand, Series } from '@/types/directus';
import { useEffect, useState, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface CarsClientProps {
  cars: CarType[];
  totalCount: number;
  currentPage: number;
  limit: number;
  brands: Brand[];
  series: Series[];
  years: number[];
  colors: string[];
  engineVolumes: number[];
  filters: {
    brand: string;
    series_id: string;
    year: string;
    mileage: string;
    mileageFrom?: string;
    mileageTo?: string;
    price: string;
    priceFrom?: string;
    priceTo?: string;
    search: string;
    color: string;
    engineVolume: string;
    sortField: string;
    sortOrder: string;
  };
  mileageRangeFormatted: [string, string];
  priceRangeFormatted: [string, string];
}

function useDebouncedEffect(effect: () => void, deps: unknown[], delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(effect, delay);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    // eslint-disable-next-line
  }, deps);
}

export default function CarsClient({
  cars,
  totalCount,
  currentPage,
  limit,
  brands,
  series,
  years,
  colors,
  engineVolumes,
  filters,
  mileageRangeFormatted,
  priceRangeFormatted
}: CarsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalCount / limit);

  // Локальный state для input-ов
  const [search, setSearch] = useState(filters.search || '');
  const [priceFrom, setPriceFrom] = useState(filters.priceFrom || '');
  const [priceTo, setPriceTo] = useState(filters.priceTo || '');
  const [mileageFrom, setMileageFrom] = useState(filters.mileageFrom || '');
  const [mileageTo, setMileageTo] = useState(filters.mileageTo || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Синхронизация state с props (при переходах)
  useEffect(() => { setSearch(filters.search || ''); }, [filters.search]);
  useEffect(() => { setPriceFrom(filters.priceFrom || ''); }, [filters.priceFrom]);
  useEffect(() => { setPriceTo(filters.priceTo || ''); }, [filters.priceTo]);
  useEffect(() => { setMileageFrom(filters.mileageFrom || ''); }, [filters.mileageFrom]);
  useEffect(() => { setMileageTo(filters.mileageTo || ''); }, [filters.mileageTo]);

  // Debounced fetch for autocomplete
  const fetchSuggestions = useDebouncedCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const res = await fetch(`/api/cars/autocomplete?query=${encodeURIComponent(q)}`);
    setSuggestions(await res.json());
    setShowDropdown(true);
  }, 250);

  useEffect(() => {
    fetchSuggestions(search);
  }, [search, fetchSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    fetchSuggestions(e.target.value);
    setShowDropdown(true);
    setHighlighted(-1);
  };

  const handleSelect = (val: string) => {
    setSearch(val);
    setShowDropdown(false);
    setSuggestions([]);
    const params = new URLSearchParams(searchParams || undefined);
    params.set('search', val);
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (highlighted >= 0 && suggestions[highlighted]) {
        handleSelect(suggestions[highlighted]);
      } else {
        handleSelect(search);
      }
    } else if (e.key === 'ArrowDown') {
      setHighlighted(h => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlighted(h => Math.max(h - 1, 0));
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 100);
  };

  // Хелпер для обновления query-параметров
  function updateQuery(params: Record<string, string | number | undefined>) {
    const sp = new URLSearchParams(window.location.search);
    Object.entries(params).forEach(([key, value]) => {
      if (value === '' || value === undefined) {
        sp.delete(key);
      } else {
        sp.set(key, String(value));
      }
    });
    router.push(`${window.location.pathname}?${sp.toString()}`);
  }

  // Debounce для поиска
  useDebouncedEffect(() => {
    if (search !== filters.search) {
      updateQuery({ search: search, page: 1 });
    }
  }, [search], 500);

  // Debounce для цены и пробега
  useDebouncedEffect(() => {
    if (priceFrom !== filters.priceFrom || priceTo !== filters.priceTo) {
      updateQuery({ priceFrom, priceTo, page: 1 });
    }
  }, [priceFrom, priceTo], 500);
  useDebouncedEffect(() => {
    if (mileageFrom !== filters.mileageFrom || mileageTo !== filters.mileageTo) {
      updateQuery({ mileageFrom, mileageTo, page: 1 });
    }
  }, [mileageFrom, mileageTo], 500);

  // Фильтрация серий по выбранному бренду
  const filteredSeries = filters.brand
    ? series.filter(s => String(s.series_brand_id) === filters.brand)
    : [];

  // Для диапазонов определяем минимальные и максимальные значения
  const minMileage = 0;
  const maxMileage = 300000;
  const minPrice = 0;
  const maxPrice = 100000;

  // Для ползунков: если значения не заданы, используем весь диапазон
  const mileageRange: [number, number] = [
    mileageFrom ? Number(mileageFrom) : minMileage,
    mileageTo ? Number(mileageTo) : maxMileage
  ];
  const priceRange: [number, number] = [
    priceFrom ? Number(priceFrom) : minPrice,
    priceTo ? Number(priceTo) : maxPrice
  ];

  // Сброс фильтров
  function handleResetFilters() {
    setSearch('');
    setPriceFrom('');
    setPriceTo('');
    setMileageFrom('');
    setMileageTo('');
    router.push(window.location.pathname);
  }

  // UI
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Каталог автомобилей</h1>
          <p className="text-gray-600">
            {totalCount > 0 ? (
              <>Найдено {totalCount} автомобилей • Страница {currentPage} из {totalPages}</>
            ) : (
              <>Нет подходящих автомобилей</>
            )}
          </p>
        </div>
        {/* Фильтры */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Бренд</label>
              <select
                value={filters.brand}
                onChange={e => updateQuery({ brand: e.target.value, series_id: '' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Все бренды</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Серия</label>
              <select
                value={filters.series_id}
                onChange={e => updateQuery({ series_id: e.target.value })}
                disabled={!filters.brand}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!filters.brand ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">Все серии</option>
                {filteredSeries.map(s => (
                  <option key={s.id} value={s.id}>{s.seriesname}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Цвет</label>
              <select
                value={filters.color}
                onChange={e => updateQuery({ color: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Все цвета</option>
                {colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Объем двигателя</label>
              <select
                value={filters.engineVolume}
                onChange={e => updateQuery({ engineVolume: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Любой объем</option>
                {engineVolumes.map(volume => (
                  <option key={volume} value={volume}>{volume} л</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Год выпуска</label>
              <select
                value={filters.year}
                onChange={e => updateQuery({ year: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Любой год</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            {/* Пробег диапазон */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Пробег, км</label>
              <div className="flex items-center justify-between text-xs mb-1">
                <span>{mileageRangeFormatted[0]} км</span>
                <span>{mileageRangeFormatted[1]} км</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min={minMileage}
                  max={maxMileage}
                  step={1000}
                  value={mileageRange[0]}
                  onChange={e => {
                    const val = Math.min(Number(e.target.value), mileageRange[1] - 1000);
                    setMileageFrom(String(val));
                  }}
                  onMouseUp={() => updateQuery({ mileageFrom, mileageTo, page: 1 })}
                  onTouchEnd={() => updateQuery({ mileageFrom, mileageTo, page: 1 })}
                  className="w-full accent-blue-600"
                />
                <input
                  type="range"
                  min={minMileage}
                  max={maxMileage}
                  step={1000}
                  value={mileageRange[1]}
                  onChange={e => {
                    const val = Math.max(Number(e.target.value), mileageRange[0] + 1000);
                    setMileageTo(String(val));
                  }}
                  onMouseUp={() => updateQuery({ mileageFrom, mileageTo, page: 1 })}
                  onTouchEnd={() => updateQuery({ mileageFrom, mileageTo, page: 1 })}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
            {/* Цена диапазон */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Цена, $</label>
              <div className="flex items-center justify-between text-xs mb-1">
                <span>${priceRangeFormatted[0]}</span>
                <span>${priceRangeFormatted[1]}</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step={100}
                  value={priceRange[0]}
                  onChange={e => {
                    const val = Math.min(Number(e.target.value), priceRange[1] - 100);
                    setPriceFrom(String(val));
                  }}
                  onMouseUp={() => updateQuery({ priceFrom, priceTo, page: 1 })}
                  onTouchEnd={() => updateQuery({ priceFrom, priceTo, page: 1 })}
                  className="w-full accent-blue-600"
                />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step={100}
                  value={priceRange[1]}
                  onChange={e => {
                    const val = Math.max(Number(e.target.value), priceRange[0] + 100);
                    setPriceTo(String(val));
                  }}
                  onMouseUp={() => updateQuery({ priceFrom, priceTo, page: 1 })}
                  onTouchEnd={() => updateQuery({ priceFrom, priceTo, page: 1 })}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
            <div className="col-span-full flex items-end justify-end">
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
        </div>
        {/* Поиск */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="relative max-w-xl mx-auto mb-6">
            <input
              ref={inputRef}
              value={search}
              onChange={handleInputChange}
              onFocus={() => setShowDropdown(true)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder="Поиск по названию, бренду, серии"
              className="w-full border rounded px-4 py-2"
              autoComplete="off"
            />
            {showDropdown && suggestions.length > 0 && (
              <ul className="absolute z-10 left-0 right-0 bg-white border rounded shadow max-h-60 overflow-auto">
                {suggestions.map((s, i) => (
                  <li
                    key={s}
                    className={`px-4 py-2 cursor-pointer ${i === highlighted ? 'bg-gray-200' : ''}`}
                    onMouseDown={() => handleSelect(s)}
                    onMouseEnter={() => setHighlighted(i)}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Сортировка */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-2">
            {[
              { field: 'date_created', label: 'Новые' },
              { field: 'year', label: 'Год' },
              { field: 'mileage', label: 'Пробег' },
              { field: 'price', label: 'Цена' }
            ].map(({ field, label }) => (
              <button
                key={field}
                onClick={() => updateQuery({ sortField: field, sortOrder: filters.sortField === field && filters.sortOrder === 'asc' ? 'desc' : 'asc', page: 1 })}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${filters.sortField === field ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {label}
                {filters.sortField === field && (
                  <span className={filters.sortOrder === 'desc' ? 'rotate-180' : ''}>▲</span>
                )}
              </button>
            ))}
          </div>
        </div>
        {/* Список авто */}
        {cars.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Нет автомобилей</h3>
              <p className="text-gray-600 mb-4">Нет автомобилей, подходящих по выбранным параметрам</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {cars.map(car => (
                <CarListItem key={car.id} car={car} />
              ))}
            </div>
            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => updateQuery({ page: Math.max(1, currentPage - 1) })}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >Назад</button>
                {/* Page numbers with ... */}
                {(() => {
                  const pages = [];
                  const maxVisible = 5;
                  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                  const end = Math.min(totalPages, start + maxVisible - 1);
                  if (end - start + 1 < maxVisible) {
                    start = Math.max(1, end - maxVisible + 1);
                  }
                  if (start > 1) {
                    pages.push(
                      <button key={1} onClick={() => updateQuery({ page: 1 })} className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>1</button>
                    );
                    if (start > 2) pages.push(<span key="start-ellipsis" className="px-2">...</span>);
                  }
                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => updateQuery({ page: i })}
                        className={`px-4 py-2 rounded-md ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      >{i}</button>
                    );
                  }
                  if (end < totalPages) {
                    if (end < totalPages - 1) pages.push(<span key="end-ellipsis" className="px-2">...</span>);
                    pages.push(
                      <button key={totalPages} onClick={() => updateQuery({ page: totalPages })} className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>{totalPages}</button>
                    );
                  }
                  return pages;
                })()}
                <button
                  onClick={() => updateQuery({ page: Math.min(totalPages, currentPage + 1) })}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >Вперед</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 