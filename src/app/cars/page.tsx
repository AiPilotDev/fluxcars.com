// src/app/cars/page.tsx
import type { Metadata } from 'next';
import CarsClient from './CarsClient';

export const metadata: Metadata = {
  title: 'Подбор авто из Китая с умными фильтрами и поиском',
  description: 'Точный подбор авто из Китая за 2 минуты! Умные фильтры и поиск экономят ваше время — выбирайте по цене, пробегу, году и комплектации без лишних вариантов.',
};

export default function CarsPage() {
  return <CarsClient />;
}