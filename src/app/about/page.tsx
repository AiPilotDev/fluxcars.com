'use client';
import { CheckCircle, ShieldCheck, Users, Zap, Car, Search, Truck, FileText } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const stepsData = [
  {
    icon: <Search className="h-8 w-8 text-blue-500" />,
    title: 'AI-подбор проверенных автомобилей',
    desc: 'Ежедневно анализируем сотни объявлений с помощью искусственного интеллекта, чтобы исключить автомобили со скрученным пробегом, аварийные и сомнительные варианты. Вы получаете только проверенные предложения с реальными ценами.'
  },
  {
    icon: <Users className="h-8 w-8 text-green-500" />,
    title: 'Бесплатный подбор под ваши требования',
    desc: 'Наши менеджеры подберут автомобиль с учетом вашего бюджета, технических предпочтений и дизайна. Мы учитываем все пожелания, чтобы найти идеальный вариант.'
  },
  {
    icon: <FileText className="h-8 w-8 text-yellow-500" />,
    title: 'Полная проверка истории автомобиля',
    desc: 'Перед покупкой мы проверяем юридическую чистоту автомобиля (отсутствие арестов, кредитов и угонов), подтверждаем реальный пробег, анализируем историю обслуживания и выявляем все факты ДТП, ремонтов и скрытых дефектов.'
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-indigo-500" />,
    title: 'Профессиональный осмотр в Китае',
    desc: 'При оплате через наших партнеров вы получаете бесплатную экспертную диагностику. Мы проверяем состояние кузова, двигателя, электроники и всех технических узлов, а также сверяем документы с фактическим состоянием автомобиля.'
  },
  {
    icon: <Truck className="h-8 w-8 text-red-500" />,
    title: 'Быстрая и надежная доставка',
    desc: 'Мы сотрудничаем с проверенными логистическими компаниями, чтобы обеспечить оперативную и безопасную доставку автомобиля. Наши партнеры помогают с таможенным оформлением и другими формальностями.'
  },
  {
    icon: <Zap className="h-8 w-8 text-pink-500" />,
    title: 'Прозрачные условия без скрытых платежей',
    desc: 'Мы не предлагаем нереалистично низких цен с подвохом — только честные сделки с гарантией надежности. Наша задача — сделать процесс покупки максимально комфортным и безопасным для вас.'
  },
];

const advantagesData = [
  {
    icon: <CheckCircle className="h-6 w-6 text-blue-500" />,
    text: 'Искусственный интеллект для точного отбора автомобилей.'
  },
  {
    icon: <Car className="h-6 w-6 text-green-500" />,
    text: 'Прямые контакты с проверенными поставщиками в Китае.'
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-yellow-500" />,
    text: 'Полная проверка перед покупкой.'
  },
  {
    icon: <Users className="h-6 w-6 text-indigo-500" />,
    text: 'Профессиональное сопровождение на всех этапах.'
  },
];

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const steps = mounted
    ? stepsData
    : stepsData.map(({ icon, ...rest }) => ({ icon: null, ...rest }));
  const advantages = mounted
    ? advantagesData
    : advantagesData.map(({ icon, ...rest }) => ({ icon: null, ...rest }));

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 py-16 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">О проекте</h1>
          <p className="text-lg sm:text-2xl font-medium mb-6">
            Наша цель — помочь вам приобрести качественный автомобиль из Китая (новый или с небольшим пробегом) без переплат, рисков и скрытых проблем. Мы берем на себя все этапы сделки, экономя ваше время и бюджет.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Как мы работаем</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, idx) => (
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
          <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {advantages.map((adv, idx) => (
              <div key={idx} className="flex items-center bg-blue-50 rounded-xl p-5 shadow-sm">
                <div className="mr-4">{adv.icon}</div>
                <span className="text-gray-800 text-lg">{adv.text}</span>
              </div>
            ))}
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