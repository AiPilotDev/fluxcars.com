'use client';

import Link from 'next/link';
import { Copyright } from './Copyright';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Партнеры */}
          <div>
            <h3 suppressHydrationWarning className="text-white text-lg font-semibold mb-4">Партнеры</h3>
            <div className="space-y-4">
              <div>
                <h4 suppressHydrationWarning className="text-white font-medium mb-2">Hefei Accord Import and Export Co., LTD</h4>
                <p className="text-sm">
                  Legal addres: Floor 12, 6-9, 11-14, Building B, No. 188, Shangcheng Avenue, Futian District, Yiwu, Jinhua City, Zhejiang Province
                </p>
                <p className="text-sm mt-1">
                  Trade register number: 913 4012 MAE3J 77X26
                </p>
              </div>
              <div>
                <h4 suppressHydrationWarning className="text-white font-medium mb-2">Anhui Shengkun Construction Machinery Co.，Ltd.</h4>
                <p className="text-sm">
                  Legal addres: Yaohai District, Hefei City, Anhui Province
                </p>
                <p className="text-sm mt-1">
                  China Trade register number: 9134 0104 MA8P 0XN19J
                </p>
              </div>
              <div className="pt-2">
                <Link href="/partners" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Все партнеры →
                </Link>
              </div>
              <div>
                <Link href="https://samochodyzchin.pl" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Samochody z Chin →
                </Link>
              </div>
            </div>
          </div>

          {/* Контакты */}
          <div>
            <h3 suppressHydrationWarning className="text-white text-lg font-semibold mb-4">Контакты</h3>
            <div className="space-y-4">
              <div>
                <h4 suppressHydrationWarning className="text-white font-medium mb-2">Беларусь:</h4>
                <p className="text-sm">
                  +375 25 732 25 75 (Telegram, WhatsApp, Viber)
                </p>
              </div>
              <div>
                <h4 suppressHydrationWarning className="text-white font-medium mb-2">English speaking support:</h4>
                <p className="text-sm">
                  + 447822032515 (WhatsApp)
                </p>
              </div>
              <div>
                <h4 suppressHydrationWarning className="text-white font-medium mb-2">Китай:</h4>
                <p className="text-sm">
                  +8613966351040 (WeChat, WhatsApp, Viber)
                </p>
              </div>
              <div>
                <h4 suppressHydrationWarning className="text-white font-medium mb-2">РФ:</h4>
                <p className="text-sm">
                  +79939242575 (Telegram, WhatsApp)
                </p>
              </div>
              <div>
                <h4 suppressHydrationWarning className="text-white font-medium mb-2">Email:</h4>
                <a href="mailto:hello@chinamotor.by" className="text-blue-400 hover:text-blue-300 transition-colors">
                  hello@chinamotor.by
                </a>
              </div>
            </div>
          </div>

          {/* Юридическая информация */}
          <div>
            <h3 suppressHydrationWarning className="text-white text-lg font-semibold mb-4">Юридическая информация</h3>
            <div className="space-y-4">
              <div>
                <h4 suppressHydrationWarning className="text-white font-medium mb-2">ООО «МарсМи»</h4>
                <p className="text-sm">
                  УНП: 193 414 593
                </p>
                <p className="text-sm">
                  ОКПО: 504090135000
                </p>
              </div>
              <div>
                <h4 suppressHydrationWarning className="text-white font-medium mb-2">Юридический адрес:</h4>
                <p className="text-sm">
                  220070, Республика Беларусь, г. Минск, улица Солтыса, дом 187, оф. 203
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя часть футера */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Copyright />
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
                Условия использования
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 