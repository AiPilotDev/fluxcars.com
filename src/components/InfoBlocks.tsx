import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export default function InfoBlocks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {/* Main Info Block */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Авто из Китая</h2>
        <p className="text-gray-600">Платформа для поиска автомобилей от продавцов из Китая</p>
      </div>

      {/* Safety Block */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">100% безопасность сделки</h2>
        <p className="text-gray-600">Финансовые гарантии нашей платформы и платежной системы Alibaba защищают ваши платежи</p>
      </div>

      {/* Film Block */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🔥 Антигравийная пленка</h2>
        <p className="text-gray-600">Полная оклейка авто в Китае за 999$</p>
      </div>

      {/* About Block - теперь всегда раскрыт */}
      <div className="bg-white rounded-lg shadow-sm p-4 col-span-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">О проекте</h2>
        <p className="text-gray-600 mt-2">
          Проект ChinaMotor.by возник из стремления сделать процесс покупки автомобилей из любой точки Китая простым, безопасным и доступным для клиентов из Беларуси и других стран. Мы создали онлайн платформу, которая устраняет языковые и культурные барьеры при проведении сделок, а также упрощает техническую проверку автомобилей. Наша ИИ-система анализирует тысячи предложений — Никаких переплат, только обоснованная стоимость и проверенные объявления.
        </p>
      </div>
    </div>
  );
} 