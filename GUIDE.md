# Руководство по основным компонентам проекта

## 1. Как реализована галерея автомобиля

### 1. Структура данных

- В Directus у автомобиля есть поле `images` — массив id файлов (UUID).
- Для получения изображения используется endpoint:
  ```
  {DIRECTUS_URL}/assets/{imageId}
  ```
- Основное изображение (`thumbnail`) может использоваться отдельно или как первое в галерее.

**Пример структуры данных автомобиля:**
```json
{
  "id": 9608,
  "carname": "GAC M6 2023 PRO 270T DCT",
  "year": 2024,
  "images": [
    "1f3e8abc-23b7-4305-8a9c-1665489d889d",
    "2a4e8abc-23b7-4305-8a9c-1665489d889d"
  ],
  "thumbnail": "1f3e8abc-23b7-4305-8a9c-1665489d889d"
}
```

---

### 2. Получение данных

**Пример запроса к API:**
```ts
const url = new URL(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/Cars`);
url.searchParams.append('filter[infoid][_eq]', infoid.toString());
url.searchParams.append('fields', '*,images.*,images.directus_files_id.*');
const response = await fetch(url.toString(), { headers: { 'Content-Type': 'application/json' } });
const data = await response.json();
const car = data.data[0];
```
- В результате `car.images` — массив объектов, где `directus_files_id.id` — это id файла.

---

### 3. Передача данных в компонент галереи

```tsx
<ImageGallery images={car.images.map(img => img.directus_files_id.id)} />
```

---

### 4. Пример компонента ImageGallery

**Профессиональный компонент с использованием next/image:**

```tsx
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
}

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;

export default function ImageGallery({ images }: ImageGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="gallery-grid">
      {images.map((id) => (
        <div className="gallery-item" key={id}>
          <Image
            src={`${DIRECTUS_URL}/assets/${id}`}
            alt="Фото автомобиля"
            width={400}
            height={300}
            className="gallery-image"
            style={{ objectFit: 'cover', borderRadius: 8 }}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
```

---

### 5. Стилизация (адаптивная сетка)

```css
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
.gallery-item {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.gallery-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}
```

---

### 6. Best practices: next/image

- Используйте компонент `next/image` для автоматической оптимизации изображений ([документация](https://nextjs.org/learn/seo/images)).
- Все изображения автоматически lazy-load.
- Поддержка современных форматов (webp, avif).
- Избегайте CLS (cumulative layout shift) — всегда указывайте width/height.

---

### 7. Пример секции галереи для интеграции с Directus Visual Editor

```tsx
import { setAttr } from '../../lib/visual-editor.js';
import Image from 'next/image';

export default function GallerySection({ id, tagline, headline, items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="gallery-section">
      <div className="container">
        {tagline && <p className="tagline" data-directus={setAttr({ collection: 'block_gallery', item: id, fields: 'tagline', mode: 'popover' })}>{tagline}</p>}
        {headline && (
          <h2 className="headline" data-directus={setAttr({ collection: 'block_gallery', item: id, fields: 'headline', mode: 'popover' })}>
            {headline}
          </h2>
        )}
        <div className="gallery-grid" data-directus={setAttr({ collection: 'block_gallery', item: id, fields: 'items', mode: 'popover' })}>
          {items.map((item, index) => (
            <div className="gallery-item" key={index}>
              {item.directus_file?.id && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${item.directus_file.id}`}
                  alt={item.directus_file.filename_download || 'Gallery image'}
                  width={400}
                  height={300}
                  className="gallery-image"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

### 8. Особенности и расширяемость

- Галерея всегда использует только изображения, связанные с конкретным автомобилем (`images`).
- Для получения файлов используется стандартный endpoint Directus `/assets/{id}`.
- Основное изображение (`thumbnail`) может использоваться отдельно или как первое в галерее.
- Компонент легко расширить до слайдера (например, с помощью Swiper или другого UI-библиотеки).
- Для интеграции с визуальным редактором Directus используйте data-атрибуты (`data-directus`).
- Адаптивная верстка, оптимизация под мобильные и десктопы.

---

**Если нужно добавить примеры слайдера, лоадер или кастомные подписи — дай знать, Andrew.**

## 1. Галерея автомобиля

**Описание:**
Галерея отображает изображения автомобиля на странице детальной карточки. Все изображения хранятся в Directus и связаны с автомобилем через массив `images` (массив UUID файлов).

**Принцип работы:**
1. При получении данных автомобиля из API Directus, в объекте присутствует массив `images`, где каждый элемент — это UUID файла изображения.
2. Галерея получает этот массив id и для каждого изображения формирует ссылку:
   - `{DIRECTUS_URL}/assets/{imageId}`
3. Компонент галереи (`ImageGallery`) отображает изображения в виде слайдера или сетки, используя, например, компонент `next/image` для оптимизации.
4. Галерея адаптивна, поддерживает просмотр на мобильных и десктопах.

**Ключевые моменты:**
- Используются только те изображения, которые связаны с конкретным автомобилем.
- Для получения файлов используется стандартный endpoint Directus `/assets/{id}`.
- Основное изображение (`thumbnail`) может использоваться отдельно или как первое в галерее.

---

## 2. Кэширование и лимит при получении списка серий

- Для получения всех серий автомобилей используется запрос:
  ```
  https://api.fluxcars.com/items/series?fields=id,seriesname&limit=5000
  ```
- Такой лимит (5000) позволяет получить полный справочник серий одним запросом даже для очень большого каталога.
- Полученный массив серий кэшируется в памяти процесса на 5 минут (TTL = 5 минут). Это позволяет:
  - Исключить лишние запросы к API при каждом рендере страницы или карточки.
  - Мгновенно получать название серии по id через объект-карту (`seriesMap`).
  - Гарантировать одинаковые данные для SSR и клиента, исключая рассинхроны.
- Если кэш устарел — он автоматически обновляется новым запросом.
- Такой подход обеспечивает максимальную производительность и масштабируемость для автокаталога любого размера.

---
