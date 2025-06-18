// src/app/cars/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Car {
  id: string;
  carname: string;
  brand: string;
  model: string;
  price: number;
  thumbnail: string | null;
}

interface DirectusResponse {
  data: Car[];
  meta: {
    total_count: number;
    filter_count: number;
  };
}

const ITEMS_PER_PAGE = 15;
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const fetchCars = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const response = await fetch(
        `${DIRECTUS_URL}/items/Cars?limit=${ITEMS_PER_PAGE}&offset=${offset}&sort=-date_created&meta=total_count,filter_count`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DirectusResponse = await response.json();
      setCars(result.data);
      setTotalCount(result.meta.total_count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getImageUrl = (thumbnail: string | null) => {
    if (!thumbnail) return null;
    return `${DIRECTUS_URL}/assets/${thumbnail}?width=400&height=300&fit=cover&quality=80`;
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Кнопка "Назад"
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Предыдущая страница"
      >
        ←
      </button>
    );

    // Первая страница
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="px-2 py-2 text-gray-500">...</span>);
      }
    }

    // Видимые страницы
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            i === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Последняя страница
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="px-2 py-2 text-gray-500">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {totalPages}
        </button>
      );
    }

    // Кнопка "Вперед"
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Следующая страница"
      >
        →
      </button>
    );

    return pages;
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
            <div className="text-red-600 mb-4 text-6xl">
              🚗
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ошибка загрузки</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchCars(currentPage)}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Каталог автомобилей</h1>
          <p className="text-gray-600">
            Найдено {totalCount} автомобилей • Страница {currentPage} из {totalPages}
          </p>
        </div>

        {/* Сетка автомобилей */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Изображение */}
              <div className="relative h-48 bg-gray-200">
                {car.thumbnail ? (
                  <Image
                    src={getImageUrl(car.thumbnail)!}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-6xl text-gray-400">🚗</div>
                  </div>
                )}
              </div>

              {/* Информация */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 truncate" title={car.carname}>
                  {car.carname}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {car.brand} • {car.model}
                </p>
                <p className="text-lg font-bold text-blue-600">
                  {formatPrice(car.price)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            {renderPagination()}
          </div>
        )}

        {/* Информация о загрузке */}
        {loading && cars.length > 0 && (
          <div className="text-center mt-4">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-800">Обновление...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}