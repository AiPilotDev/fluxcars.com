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

## Настройка коллекций brands и cars в Directus

### 1. Создание коллекции brands
- Перейдите в **Settings → Data Model → Create Collection**
- Укажите:
  - **Collection Name:** `brands`
  - **Icon (опционально):** например, "label"
  - **Note (опционально):** "Бренды автомобилей"
  - Остальные настройки оставьте по умолчанию (Singleton: Off, Hidden: Off)

### 2. Добавьте поле в коллекцию brands
- В созданной коллекции `brands` добавьте поле:
  - **Field Name:** `name`
  - **Type:** `String`
  - **Interface:** `Input`
  - **Required:** Да

### 3. Создайте связь с коллекцией cars
- Откройте коллекцию `cars`
- Добавьте новое поле:
  - **Field Name:** `brand_id`
  - **Type:** `Many-to-One`
  - **Interface:** `Dropdown` или `Select Dropdown`
  - **Related Collection:** `brands`

Теперь при создании или редактировании автомобиля в коллекции `cars` будет доступен выбор бренда из коллекции `brands` через выпадающий список.

## Структура коллекций и связей (Directus)

### Коллекция `brands`
- **id**: string/number — уникальный идентификатор бренда
- **name**: string — название бренда (например, "BMW")

### Коллекция `Cars`
- **id**: string/number — уникальный идентификатор автомобиля
- **carname**: string — полное название авто
- **brand_id**: string/number — связь (relation) с коллекцией `brands` (id бренда)
- **model**: string — модель авто
- ... (другие поля: year, price, mileage, color, images и т.д.)

### Связь
- Каждая запись в `Cars` содержит поле `brand_id`, которое ссылается на `brands.id`.
- Для получения названия бренда всегда используйте связь через `brand_id` и коллекцию `brands`.

### Пример получения бренда для авто
```ts
// Получить название бренда по brand_id
const brand = brands.find(b => String(b.id) === String(car.brand_id));
const brandName = brand?.name || '—';
```

> Вся фильтрация, ссылки и отображение брендов в проекте строятся только через связь `brand_id` → `brands.id`.

> Внимание: коллекция `brands` может содержать более 180 брендов. Для получения полного списка используйте пагинацию (параметры `limit` и `offset`).

## Примеры API-запросов (Directus)

### Получить список брендов (с пагинацией)
```
GET {DIRECTUS_URL}/items/brands?fields=id,name&sort=name&limit=200&offset=0
```

### Получить список автомобилей с брендом (brand_id)
```
GET {DIRECTUS_URL}/items/Cars?fields=*,brand_id&limit=200&offset=0
```

### Получить все автомобили определённого бренда
```
GET {DIRECTUS_URL}/items/Cars?filter[brand_id][_eq]={brandId}&fields=*,brand_id&limit=200&offset=0
```

> Для больших выборок используйте пагинацию: увеличивайте offset (например, offset=200, offset=400 и т.д.)

## Пример фильтрации и сортировки по бренду и модели

### 1. Получение брендов
```http
GET /items/brands?fields=id,name&sort=name&limit=1000
```

### 2. Получение моделей (серий) по бренду
```http
GET /api/cars/models?brand_id={brandId}
// Ответ: { "series": [ { "id": 26, "name": "BMW X1" }, ... ] }
```

### 3. Фильтрация автомобилей по бренду и модели
```http
GET /items/Cars?filter[brand_id][_eq]={brandId}&filter[series_id][_eq]={seriesId}&fields=*,brand_id,series_id&limit=100
```

### 4. Сортировка
- По цене: `sort=price` (по возрастанию), `sort=-price` (по убыванию)
- По году: `sort=year` или `sort=-year`

**Пример:**
```http
GET /items/Cars?filter[brand_id][_eq]=1&filter[series_id][_eq]=26&sort=-price&fields=*,brand_id,series_id&limit=100
```

### UI-логика
1. Пользователь выбирает бренд (`brand_id`) из выпадающего списка.
2. После выбора бренда отправляется запрос `/api/cars/models?brand_id=...` для получения моделей (серий).
3. Пользователь выбирает модель (`series_id`) из второго выпадающего списка.
4. При отправке формы оба значения (`brand_id`, `series_id`) и параметры сортировки используются для поиска автомобилей.

---

## ER-диаграмма (Mermaid)

```mermaid
erDiagram
  Cars {
    string id
    string carname
    string brand_id
    string model
    ...
  }
  Brands {
    string id
    string name
  }
  Cars ||--o{ Brands : "brand_id"
```

---

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
