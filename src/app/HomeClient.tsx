'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Car, Brand, Series } from '@/types/directus';
import { 
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  TruckIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClipboardIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import CarListItem from '@/components/CarListItem';

interface PopularBrand {
  id: number;
  name: string;
  count: number;
}
interface HomeClientProps {
  brands: Brand[];
  seriesList: Series[];
  newCars: Car[];
  popularBrands: PopularBrand[];
}

function HeroSearchForm({ brands, seriesList }: { brands: Brand[]; seriesList: Series[] }) {
  const [brand, setBrand] = useState<number | ''>('');
  const [model, setModel] = useState<number | ''>('');
  const [search, setSearch] = useState('');

  // Фильтруем серии по бренду (как на /cars)
  const filteredSeries = brand
    ? seriesList.filter(s => String(s.series_brand_id) === String(brand))
    : [];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (brand) params.append('brand', String(brand));
    if (model) {
      params.append('model', String(model));
      params.append('series_id', String(model));
    }
    params.append('page', '1');
    window.location.href = `/cars?${params.toString()}`;
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col gap-3 md:gap-4 w-full text-left">
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Поиск</label>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Марка, модель..." className="w-full px-3 py-2 rounded-md bg-gray-900 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-cyan-400 outline-none" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Бренд</label>
        <select value={brand} onChange={e => { setBrand(e.target.value ? Number(e.target.value) : ''); setModel(''); }} className="w-full px-3 py-2 rounded-md bg-gray-900 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-cyan-400 outline-none">
          <option value="">Все бренды</option>
          {brands.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Модель</label>
        <select value={model} onChange={e => setModel(e.target.value ? Number(e.target.value) : '')} className="w-full px-3 py-2 rounded-md bg-gray-900 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-cyan-400 outline-none" disabled={!brand}>
          <option value="">Все модели</option>
          {filteredSeries.map(m => (
            <option key={m.id} value={m.id}>{m.seriesname}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="mt-2 w-full bg-gradient-to-r from-cyan-700 to-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:from-cyan-500 hover:to-blue-400 transition ring-2 ring-cyan-400 ring-offset-2">Найти авто</button>
    </form>
  );
}

export default function HomeClient({ brands, seriesList, newCars, popularBrands }: HomeClientProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section на всю ширину экрана */}
      <section className="relative max-w-full mx-auto flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-slate-800 text-white overflow-hidden shadow-2xl border-b-4 border-slate-700 px-0 py-0">
        <div className="absolute inset-0 bg-[url('/globe.svg')] bg-cover bg-center opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-slate-800/80 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full px-4 py-8 gap-6 text-center lg:text-left">
          {/* Блок с заголовком и описанием */}
          <div className="flex flex-col items-center lg:items-start justify-center w-full max-w-lg p-0 md:p-0">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 md:mb-4 text-white leading-tight" style={{letterSpacing: '0.04em'}}>Авто из Китая</h1>
            <p className="text-lg md:text-2xl font-semibold text-cyan-700 mb-3 md:mb-4">Платформа для поиска автомобилей от продавцов из Китая</p>
            <p className="text-base md:text-lg mb-0 md:mb-4 text-white">100% безопасность сделки. Финансовые гарантии нашей платформы и платёжной системы <span className='font-bold text-lime-600'>Alibaba</span> защищают ваши платежи</p>
          </div>
          {/* Форма поиска */}
          <div className="flex items-center justify-center w-full max-w-lg">
            <div className="w-full">
              <HeroSearchForm brands={brands} seriesList={seriesList} />
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
          {popularBrands.length > 0 && (
            <section className="bg-white rounded-2xl shadow-lg p-4 mb-8 w-full container mx-auto mt-10">
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
                {popularBrands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/cars/brand/${encodeURIComponent(brand.name)}`}
                    className="bg-gray-50 rounded-xl p-3 shadow-sm hover:bg-blue-50 transition-colors flex flex-col items-start border border-gray-100 group w-full"
                  >
                    <h3 className="font-semibold text-base mb-0.5 text-gray-900 group-hover:text-blue-700 transition-colors">{brand.name}</h3>
                    <span className="text-xs text-gray-500">{brand.count} авто</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Cars Grid */}
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
        </div>
      </div>
    </div>
  );
} 