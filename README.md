## Описание бизнес-логики и структуры страниц

**FluxCars** — онлайн-платформа для поиска, проверки и покупки автомобилей из Китая. Проект устраняет языковые и культурные барьеры, обеспечивает прозрачность, безопасность и удобство сделки.

### Бизнес-логика

- **AI-подбор автомобилей:** ежедневно анализируются сотни объявлений с помощью искусственного интеллекта, чтобы исключить сомнительные варианты (скрученный пробег, аварии, скрытые дефекты).
- **Фильтрация и поиск:** пользователи могут искать авто по бренду, модели, году, цене, пробегу, цвету и другим параметрам. Доступны быстрые подсказки и фильтры.
- **Проверка и безопасность:** все автомобили проходят юридическую и техническую проверку, включая VIN, историю обслуживания, участие в ДТП, ограничения и залоги.
- **Платежи и доставка:** оплата осуществляется через защищённую систему Escrow (Alibaba Pay), доставка — только через проверенных логистических партнёров.
- **Документы и легализация:** авто готово к легальному ввозу и регистрации, все документы предоставляются клиенту.
- **Персональные данные:** обработка и хранение персональных данных соответствует законодательству и политике конфиденциальности.

### Логика по страницам

- **Главная (`/`):** краткое описание сервиса, преимущества, этапы работы, блоки с AI-подбором, бесплатным подбором, проверкой истории, условиями доставки и прозрачности.
- **Поиск авто (`/cars`):** основной каталог автомобилей с фильтрами, сортировкой, пагинацией, быстрыми подсказками и отображением карточек авто.
- **Страница бренда (`/cars/brand/[brand]`):** каталог автомобилей выбранного бренда с фильтрами по моделям, годам и другим параметрам.
- **Страница модели (`/cars/model/[model]`):** каталог автомобилей выбранной модели с фильтрами.
- **Страница авто (`/cars/[infoid]`):** детальная карточка автомобиля с галереей, описанием, техническими характеристиками, контактами и похожими предложениями.
- **О проекте (`/about`):** подробное описание миссии, этапов работы, гарантий, преимуществ платформы и используемых технологий.
- **Политика обработки данных (`/policy`):** информация о принципах и целях обработки персональных данных, правах пользователей и обязанностях платформы.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
