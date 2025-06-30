import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Авто из Китая — Купить Китайские автомобили с доставкой в СНГ, Евросоюз, страны Азии',
  description: 'Авто из Китая 🚗 Наша платформа помогает купить китайские автомобили с полной проверкой, безопасной сделкой и доставкой. AI-подбор, проверка истории, финансовая защита через Alibaba.\nБесплатный подбор под ваш бюджет. Доставка во все страны мира',
};

export default function HomePage() {
  return <HomeClient />;
}
