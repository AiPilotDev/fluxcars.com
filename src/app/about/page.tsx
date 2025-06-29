'use client';
import { ShieldCheck, Users, Zap, Search, FileText, Globe, DollarSign, FileCheck2, ClipboardCheck, Banknote } from 'lucide-react';

const problemsData = [
  {
    icon: <Globe className="h-7 w-7 text-blue-500" />, 
    text: 'Экономия времени и нервов – никаких скрытых проблем после покупки.',
  },
  {
    icon: <DollarSign className="h-7 w-7 text-green-500" />, 
    text: 'Даём доступ к реальным ценам, без накруток',
  },
  {
    icon: <ShieldCheck className="h-7 w-7 text-yellow-500" />, 
    text: 'Проверяем автомобили на всех этапах',
  },
  {
    icon: <FileCheck2 className="h-7 w-7 text-indigo-500" />, 
    text: 'Обеспечиваем безопасность сделки и прозрачную оплату',
  },
];

const howWeDoData = [
  {
    icon: <Banknote className="h-8 w-8 text-blue-500" />,
    title: 'Оплата через Alibaba Pay Escrow',
    desc: 'Ваш платёж проходит через защищённую систему Escrow. Деньги хранятся на счёте Chouzhou Commercial Bank и поступают продавцу только после отправки автомобиля.'
  },
  {
    icon: <Users className="h-8 w-8 text-green-500" />,
    title: 'Работаем только с проверенными поставщиками',
    desc: 'Все наши партнёры — с историей, рейтингами и официальными каналами на Alibaba. Это исключает "серые" схемы и снижает риски.'
  },
  {
    icon: <FileText className="h-8 w-8 text-yellow-500" />,
    title: 'Проверяем автомобили до отправки',
    desc: 'VIN, пробег, сервисные записи, участие в ДТП, ограничения и залоги — всё проверяется по заводским и правовым базам.'
  },
  {
    icon: <ClipboardCheck className="h-8 w-8 text-indigo-500" />,
    title: 'Технический осмотр в Шанхае',
    desc: 'Мотор, коробка, подвеска, электрика, кузов — проходит диагностику на складе.'
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-red-500" />,
    title: 'Экспортный аудит',
    desc: 'Каждый автомобиль проходит обязательную государственную сертификацию перед вывозом. Без этой проверки экспорт невозможен. Вы получаете официальный протокол соответствия.'
  },
];

const whyConvenientData = [
  {
    icon: <DollarSign className="h-6 w-6 text-blue-500" />,
    text: 'Прозрачные цены — как на китайских автомобильных платформах, без наценок',
  },
  {
    icon: <FileCheck2 className="h-6 w-6 text-green-500" />,
    text: 'Документы в порядке — авто готово к легальному ввозу и регистрации',
  },
  {
    icon: <Search className="h-6 w-6 text-yellow-500" />,
    text: 'Всё под контролем — вы знаете, что покупаете, и в каком состоянии',
  },
  {
    icon: <Zap className="h-6 w-6 text-indigo-500" />,
    text: 'Без лишних затрат времени и нервов — мы всё проверяем до отгрузки',
  },
];

export default function AboutPage() {
  const problems = problemsData;
  const howWeDo = howWeDoData;
  const whyConvenient = whyConvenientData;

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-slate-800 py-16 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">О FluxCars</h1>
          <p className="text-lg sm:text-2xl font-medium mb-6">
            FluxCars — это платформа для покупки автомобилей из Китая с доставкой в любую страну. Мы делаем процесс понятным, безопасным и управляемым: от выбора авто — до оформления и экспорта.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Что решает FluxCars</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {problems.map((item, idx) => (
              <div key={idx} className="flex items-center bg-blue-50 rounded-xl p-5 shadow-sm">
                <div className="mr-4">{item.icon}</div>
                <span className="text-gray-800 text-lg">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-600 mb-10 text-center">Как мы это делаем</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {howWeDo.map((step, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-2xl">
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">Почему это удобно</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whyConvenient.map((adv, idx) => (
              <div key={idx} className="flex items-center bg-blue-50 rounded-xl p-5 shadow-sm">
                <div className="mr-4">{adv.icon}</div>
                <span className="text-gray-800 text-lg">{adv.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">FluxCars — покупка авто из Китая, как из салона рядом с домом.</h2>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Свяжитесь с нами</h2>
            <div className="space-y-2 text-gray-800 text-lg">
              <div>Беларусь: <a href="https://wa.me/375257322575" className="text-blue-600 hover:underline">+375257322575</a> <span className="text-sm text-gray-500">(WhatsApp, Telegram)</span></div>
              <div>РФ: <a href="https://wa.me/79939242575" className="text-blue-600 hover:underline">+79939242575</a> <span className="text-sm text-gray-500">(WhatsApp, Telegram)</span></div>
              <div>Email: <a href="mailto:hello@chinamotor.by" className="text-blue-600 hover:underline">hello@chinamotor.by</a></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}