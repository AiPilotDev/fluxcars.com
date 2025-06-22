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
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-slate-800 text-white py-28 mb-16 overflow-hidden shadow-2xl border-b-4 border-slate-700 min-h-[520px] flex items-center">
          <div className="absolute inset-0 bg-[url('/globe.svg')] bg-cover bg-center opacity-5" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-slate-800/80" />
          <div className="container mx-auto px-4 relative z-10 flex flex-col-reverse lg:flex-row-reverse items-center justify-center gap-10 lg:gap-20 text-center lg:text-left">
            {/* Форма поиска справа на десктопе, снизу на мобиле */}
            <div className="w-full max-w-md lg:max-w-sm flex-shrink-0 mb-8 lg:mb-0">
              <HeroSearchForm />
            </div>
            {/* Блок с заголовком и описанием */}
            <div className="flex flex-col items-center lg:items-start justify-center flex-1 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg tracking-widest text-slate-100 leading-tight" style={{letterSpacing: '0.04em'}}>Платформа для поиска автомобилей от продавцов из Китая</h1>
              <p className="text-2xl md:text-3xl font-semibold text-cyan-300 mb-4 drop-shadow">100% безопасность сделки</p>
              <p className="text-lg md:text-xl mb-0 md:mb-4 text-slate-300">Финансовые гарантии нашей платформы и платёжной системы <span className='font-bold text-lime-400'>Alibaba</span> защищают ваши платежи</p>
            </div>
          </div>
        </section>

        <div>
          {/* --- Услуги: Антигравийная пленка и Антикоррозийное покрытие --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center bg-white rounded-2xl shadow-lg p-8 text-xl font-semibold gap-6 border-l-4 border-cyan-400">
              <span className="text-4xl">🧊</span>
              <span className="text-gray-900 font-semibold" style={{fontFamily: 'Montserrat, Arial, sans-serif'}}>Полная оклейка авто антигравийной пленкой в Китае — <span className="text-cyan-700 font-bold">999$</span></span>
            </div>
            <div className="flex items-center bg-white rounded-2xl shadow-lg p-8 text-xl font-semibold gap-6 border-l-4 border-lime-400">
              <span className="text-4xl">🛡️</span>
              <span className="text-gray-900 font-semibold" style={{fontFamily: 'Montserrat, Arial, sans-serif'}}>Полное антикорозийное покрытие автомобиля — <span className="text-lime-700 font-bold">399$</span></span>
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

          {/* Features Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Преимущества</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div className="flex items-center bg-white rounded-2xl shadow border-l-4 border-blue-100 p-5 gap-4" style={{borderColor:'#dbeafe'}}>
                <span className="text-2xl" style={{color:'#60a5fa'}}>🔧</span>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-gray-800" style={{fontFamily:'Montserrat, Arial, sans-serif'}}>Техническая проверка</h3>
                  <p className="text-sm text-gray-500">Техническая проверка и проверка продавца проводятся через наших партнёров в Китае.</p>
                </div>
              </div>
              <div className="flex items-center bg-white rounded-2xl shadow border-l-4 border-green-100 p-5 gap-4" style={{borderColor:'#bbf7d0'}}>
                <span className="text-2xl" style={{color:'#34d399'}}>🤝</span>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-gray-800" style={{fontFamily:'Montserrat, Arial, sans-serif'}}>Безопасная сделка</h3>
                  <p className="text-sm text-gray-500">Сделка оформляется через представителей в Китае и Беларуси.</p>
                </div>
              </div>
              <div className="flex items-center bg-white rounded-2xl shadow border-l-4 border-yellow-100 p-5 gap-4" style={{borderColor:'#fef9c3'}}>
                <span className="text-2xl" style={{color:'#fde047'}}>💰</span>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-gray-800" style={{fontFamily:'Montserrat, Arial, sans-serif'}}>Финансовые гарантии</h3>
                  <p className="text-sm text-gray-500">Мы предоставляем финансовые гарантии на доставку автомобиля.</p>
                </div>
              </div>
              <div className="flex items-center bg-white rounded-2xl shadow border-l-4 border-cyan-100 p-5 gap-4" style={{borderColor:'#cffafe'}}>
                <span className="text-2xl" style={{color:'#22d3ee'}}>🚚</span>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-gray-800" style={{fontFamily:'Montserrat, Arial, sans-serif'}}>Доставка</h3>
                  <p className="text-sm text-gray-500">Доставка осуществляется в Беларусь, Польшу, страны Балтии, Россию и другие страны СНГ.</p>
                </div>
              </div>
              <div className="flex items-center bg-white rounded-2xl shadow border-l-4 border-purple-100 p-5 gap-4" style={{borderColor:'#ede9fe'}}>
                <span className="text-2xl" style={{color:'#a78bfa'}}>🧑‍💼</span>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-gray-800" style={{fontFamily:'Montserrat, Arial, sans-serif'}}>Поддержка</h3>
                  <p className="text-sm text-gray-500">Менеджеры бесплатно помогают подобрать подходящий автомобиль и сопровождают на всех этапах.</p>
                </div>
              </div>
              <div className="flex items-center bg-white rounded-2xl shadow border-l-4 border-gray-200 p-5 gap-4" style={{borderColor:'#e5e7eb'}}>
                <span className="text-2xl" style={{color:'#9ca3af'}}>ℹ️</span>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-gray-800" style={{fontFamily:'Montserrat, Arial, sans-serif'}}>Дополнительно</h3>
                  <p className="text-sm text-gray-500">В стоимость не входят доставка и таможенные сборы.</p>
                </div>
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
      <button type="submit" className="mt-2 w-full bg-gradient-to-r from-cyan-700 to-lime-500 text-gray-900 font-bold py-3 rounded-lg shadow-lg hover:from-cyan-500 hover:to-lime-400 transition ring-2 ring-cyan-400 ring-offset-2">Найти авто</button>
    </form>
  );
}
