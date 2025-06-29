'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { directusAPI } from '@/lib/directus';
import { Car } from '@/types/directus';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  TruckIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClipboardIcon,
  StarIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import CarListItem from '@/components/CarListItem';
import InfoBlocks from '@/components/InfoBlocks';
import { formatError } from '@/utils/formatError';
import { formatPrice } from '@/utils/formatPrice';
import { useRouter } from 'next/navigation';

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
  const [showFeatures, setShowFeatures] = useState(false);
  const [topBrands, setTopBrands] = useState<TopBrand[]>([]);
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [newCars, setNewCars] = useState<Car[]>([]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadData();
      loadTopBrands();
      loadFeaturedCars();
      loadNewCars();
    }
  }, [mounted, currentPage, sortField, sortDirection]);

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

      const response = await directusAPI.getCars(params);
      setCars(response.data);
      setTotalCount(response.meta?.total_count || 0);
      console.log('Всего авто:', response.data.length, 'Новых авто:', response.data.filter(car => car.condition === 'New').length, response.data.map(car => car.condition));
    } catch (err) {
      console.error('Error fetching cars:', formatError(err));
      setError(formatError(err));
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

  const loadNewCars = async () => {
    try {
      const response = await directusAPI.getCars({
        filter: { condition: { _eq: 'New' } },
        sort: '-date_created',
        limit: 8
      });
      setNewCars(response.data);
    } catch (err) {
      console.error('Error fetching new cars:', formatError(err));
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section на всю ширину экрана */}
      <section className="relative max-w-full mx-auto flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-slate-800 text-white overflow-hidden shadow-2xl border-b-4 border-slate-700 px-0 py-0">
        <div className="absolute inset-0 bg-[url('/globe.svg')] bg-cover bg-center opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-slate-800/80 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full px-4 py-8 gap-6 text-center lg:text-left">
          {/* Блок с заголовком и описанием */}
          <div className="flex flex-col items-center lg:items-start justify-center w-full max-w-lg bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-5 md:p-8 backdrop-blur-md">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 md:mb-4 text-gray-900 dark:text-slate-100 leading-tight" style={{letterSpacing: '0.04em'}}>Авто из Китая</h1>
            <p className="text-lg md:text-2xl font-semibold text-cyan-700 dark:text-cyan-300 mb-3 md:mb-4">Платформа для поиска автомобилей от продавцов из Китая</p>
            <p className="text-base md:text-lg mb-0 md:mb-4 text-gray-700 dark:text-slate-300">100% безопасность сделки. Финансовые гарантии нашей платформы и платёжной системы <span className='font-bold text-lime-600 dark:text-lime-400'>Alibaba</span> защищают ваши платежи</p>
          </div>
          {/* Форма поиска */}
          <div className="flex items-center justify-center w-full max-w-lg">
            <div className="w-full">
              <HeroSearchForm />
            </div>
          </div>
        </div>
      </section>
      {/* Остальной контент ограничен контейнером */}
      <div className="container mx-auto px-4 mt-10">
        <div>
          {/* --- Услуги: Антигравийная пленка и Антикоррозийное покрытие --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center bg-white rounded-2xl shadow-xl p-6 md:p-8 gap-6">
              <span className="text-5xl md:text-6xl select-none">🧊</span>
              <div className="flex flex-col">
                <span className="text-gray-900 font-semibold text-lg md:text-xl mb-1" style={{fontFamily: 'Montserrat, Arial, sans-serif'}}>Полная оклейка авто антигравийной пленкой</span>
                <span className="text-gray-500 text-sm mb-2">в Китае</span>
                <span className="text-cyan-700 font-extrabold text-2xl md:text-3xl tracking-tight">999$</span>
              </div>
            </div>
            <div className="flex items-center bg-white rounded-2xl shadow-xl p-6 md:p-8 gap-6">
              <span className="text-5xl md:text-6xl select-none">🛡️</span>
              <div className="flex flex-col">
                <span className="text-gray-900 font-semibold text-lg md:text-xl mb-1" style={{fontFamily: 'Montserrat, Arial, sans-serif'}}>Полное антикорозийное покрытие автомобиля</span>
                <span className="text-gray-500 text-sm mb-2">в Китае</span>
                <span className="text-lime-700 font-extrabold text-2xl md:text-3xl tracking-tight">399$</span>
              </div>
            </div>
          </div>
          <style jsx global>{`
            .car-block {
              box-shadow: 0 2px 12px 0 #b0b6bb33, 0 1px 0 0 #b0b6bb;
              border-style: solid;
              border-width: 1.5px;
            }
            .car-text {
              font-family: 'Montserrat', 'Arial', sans-serif;
              letter-spacing: 0.01em;
              text-shadow: none;
            }
            .car-price {
              text-shadow: none;
            }
          `}</style>

          {/* Как мы работаем */}
          <section className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-600">Как мы работаем</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-blue-50 rounded-2xl shadow p-6 flex flex-col items-center text-center">
                <AdjustmentsHorizontalIcon className="h-8 w-8 text-blue-500 mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">AI-подбор проверенных автомобилей</h3>
                <p className="text-gray-600 text-sm">Ежедневно анализируем сотни объявлений с помощью искусственного интеллекта, чтобы исключить автомобили со скрученным пробегом, аварийные и сомнительные варианты. Вы получаете только проверенные предложения с реальными ценами.</p>
              </div>
              <div className="bg-green-50 rounded-2xl shadow p-6 flex flex-col items-center text-center">
                <UserGroupIcon className="h-8 w-8 text-green-500 mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Бесплатный подбор под ваши требования</h3>
                <p className="text-gray-600 text-sm">Наши менеджеры подберут автомобиль с учетом вашего бюджета, технических предпочтений и дизайна. Мы учитываем все пожелания, чтобы найти идеальный вариант.</p>
              </div>
              <div className="bg-yellow-50 rounded-2xl shadow p-6 flex flex-col items-center text-center">
                <ClipboardIcon className="h-8 w-8 text-yellow-500 mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Полная проверка истории автомобиля</h3>
                <p className="text-gray-600 text-sm">Перед покупкой мы проверяем юридическую чистоту автомобиля, подтверждаем реальный пробег, анализируем историю обслуживания и выявляем все факты ДТП, ремонтов и скрытых дефектов.</p>
              </div>
              <div className="bg-indigo-50 rounded-2xl shadow p-6 flex flex-col items-center text-center">
                <ShieldCheckIcon className="h-8 w-8 text-indigo-500 mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Профессиональный осмотр в Китае</h3>
                <p className="text-gray-600 text-sm">При оплате через наших партнеров вы получаете бесплатную экспертную диагностику. Проверяем состояние кузова, двигателя, электроники и всех технических узлов.</p>
              </div>
              <div className="bg-red-50 rounded-2xl shadow p-6 flex flex-col items-center text-center">
                <TruckIcon className="h-8 w-8 text-red-500 mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Быстрая и надежная доставка</h3>
                <p className="text-gray-600 text-sm">Сотрудничаем с проверенными логистическими компаниями для оперативной и безопасной доставки. Помогаем с таможенным оформлением и формальностями.</p>
              </div>
              <div className="bg-pink-50 rounded-2xl shadow p-6 flex flex-col items-center text-center">
                <CurrencyDollarIcon className="h-8 w-8 text-pink-500 mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Прозрачные условия без скрытых платежей</h3>
                <p className="text-gray-600 text-sm">Только честные сделки с гарантией надежности. Наша задача — сделать процесс покупки максимально комфортным и безопасным для вас.</p>
              </div>
            </div>
          </section>

          {/* Почему выбирают нас */}
          <section className="bg-blue-50 rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Почему выбирают нас</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center bg-white rounded-xl p-5 shadow-sm">
                <CheckCircleIcon className="h-6 w-6 text-blue-500 mr-4" />
                <span className="text-gray-800 text-lg">Искусственный интеллект для точного отбора автомобилей.</span>
              </div>
              <div className="flex items-center bg-white rounded-xl p-5 shadow-sm">
                <StarIcon className="h-6 w-6 text-green-500 mr-4" />
                <span className="text-gray-800 text-lg">Прямые контакты с проверенными поставщиками в Китае.</span>
              </div>
              <div className="flex items-center bg-white rounded-xl p-5 shadow-sm">
                <ShieldCheckIcon className="h-6 w-6 text-yellow-500 mr-4" />
                <span className="text-gray-800 text-lg">Полная проверка перед покупкой.</span>
              </div>
              <div className="flex items-center bg-white rounded-xl p-5 shadow-sm">
                <UserGroupIcon className="h-6 w-6 text-indigo-500 mr-4" />
                <span className="text-gray-800 text-lg">Профессиональное сопровождение на всех этапах.</span>
              </div>
            </div>
          </section>

          {/* Top Brands Section */}
          <section className="bg-white rounded-2xl shadow-lg p-4 mb-8 w-full">
            <div className="flex justify-between items-center mb-4 w-full">
              <h2 className="text-2xl font-bold">Популярные марки</h2>
              <Link 
                href="/cars/brand"
                className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
              >
                Все марки →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
              {topBrands.map(({ brand, count }) => (
                <Link
                  key={brand}
                  href={`/cars/brand/${encodeURIComponent(brand)}`}
                  className="bg-gray-50 rounded-xl p-3 shadow-sm hover:bg-blue-50 transition-colors flex flex-col items-start border border-gray-100 group w-full"
                >
                  <h3 className="font-semibold text-base mb-0.5 text-gray-900 group-hover:text-blue-700 transition-colors">{brand}</h3>
                  <p className="text-xs text-gray-500">{count} автомобилей</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Cars Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Новые авто</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {newCars.length === 0 ? (
                  <div className="col-span-4 text-gray-500">Нет новых авто</div>
                ) : (
                  newCars.slice(0, 8).map((car) => (
                    <CarListItem key={car.id} car={car} />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function HeroSearchForm() {
  const router = useRouter();
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Имитация загрузки брендов/моделей (лучше вынести в API)
    fetch('/api/cars/filter-options').then(res => res.json()).then(data => {
      setBrands(data.brands || []);
    });
  }, []);

  useEffect(() => {
    if (brand) {
      fetch(`/api/cars/models?brand=${encodeURIComponent(brand)}`)
        .then(res => res.json())
        .then(data => setModels(data.models || []));
    } else {
      setModels([]);
    }
  }, [brand]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (brand) params.append('brand', brand);
    if (model) params.append('model', model);
    router.push(`/cars?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col gap-3 md:gap-4 w-full text-left">
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Поиск</label>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Марка, модель..." className="w-full px-3 py-2 rounded-md bg-gray-900 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-cyan-400 outline-none" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Бренд</label>
        <select value={brand} onChange={e => setBrand(e.target.value)} className="w-full px-3 py-2 rounded-md bg-gray-900 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-cyan-400 outline-none">
          <option value="">Все бренды</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Модель</label>
        <select value={model} onChange={e => setModel(e.target.value)} className="w-full px-3 py-2 rounded-md bg-gray-900 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-cyan-400 outline-none" disabled={!brand}>
          <option value="">Все модели</option>
          {models.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <button type="submit" className="mt-2 w-full bg-gradient-to-r from-cyan-700 to-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:from-cyan-500 hover:to-blue-400 transition ring-2 ring-cyan-400 ring-offset-2">Найти авто</button>
    </form>
  );
}
