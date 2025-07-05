# FluxCars API Документация

## Общая информация

- **CMS**: Directus
- **Базовый URL**: `https://api.fluxcars.com/items/`
- **Типы данных**: JSON
- **Аутентификация**: Не указана (предполагается публичный доступ к данным)

---

## 1. Серии автомобилей

### Получить список серий

- **Endpoint**: `/series`
- **Метод**: `GET`
- **Описание**: Возвращает список серий автомобилей с привязкой к бренду.

#### Пример запроса

```
GET https://api.fluxcars.com/items/series
```

#### Пример ответа

```json
[
  {
    "id": 46,
    "status": "published",
    "sort": null,
    "seriesname": "BMW 5 Series",
    "series_brand_id": 12
  },
  {
    "id": 6,
    "status": "published",
    "sort": null,
    "seriesname": "Mercedes-Maybach S-Class",
    "series_brand_id": 18
  },
  {
    "id": 26,
    "status": "published",
    "sort": null,
    "seriesname": "BMW X1",
    "series_brand_id": 12
  }
]
```

- **Поля**:
  - `id` — уникальный идентификатор серии
  - `seriesname` — название серии
  - `series_brand_id` — идентификатор бренда (связь с брендами)

---

## 2. Бренды

### Получить список брендов

- **Endpoint**: `/brands`
- **Метод**: `GET`
- **Описание**: Возвращает список брендов с массивом id серий, относящихся к каждому бренду.

#### Пример запроса

```
GET https://api.fluxcars.com/items/brands
```

#### Пример ответа

```json
[
  {
    "id": 16,
    "status": "published",
    "sort": null,
    "name": "Audi",
    "series": [4]
  }
]
```

- **Поля**:
  - `id` — уникальный идентификатор бренда
  - `name` — название бренда
  - `series` — массив id серий (один ко многим: бренд → серии)

---

## 3. Карточка автомобиля

### Получить список автомобилей

- **Endpoint**: `/Cars`
- **Метод**: `GET`
- **Описание**: Возвращает список автомобилей с подробной информацией.

#### Пример запроса

```
GET https://api.fluxcars.com/items/Cars
```

#### Пример ответа

```json
[
  {
    "id": 9608,
    "status": "published",
    "sort": null,
    "user_created": "0f04700c-a7c3-4417-b0af-1813ec361d93",
    "date_created": "2025-07-01T12:21:14.736Z",
    "carname": "GAC M6 2023 PRO 270T DCT",
    "year": 2024,
    "mileage": 3800,
    "price": 15774,
    "delivery_price": 19574,
    "description": "<table>...</table>",
    "thumbnail": "1f3e8abc-23b7-4305-8a9c-1665489d889d",
    "condition": "NEW",
    "transmission": "Автоматическая",
    "fuel_type": "Бензин",
    "car_type": "Compact MPV",
    "vin": "LMGKT1L56R1218703",
    "external_id": null,
    "color": "Белый",
    "acceleration": "9.4",
    "range": null,
    "battery_power": "0",
    "fast_charge_time": "0",
    "slow_charge_time": "0",
    "meta_title": "Покупка авто GAC M6 2023 PRO 270T DCT в Китае за $ 15774",
    "meta_description": "Поиск, покупка доставка авто GAC M6 2023 PRO 270T DCT из Китая. Цвет Белый За $ 15774",
    "slug": "GAC M6 2023 PRO 270T DCT-54709020",
    "infoid": 54709020,
    "displacement": null,
    "engine_volume": 1.5,
    "brand_id": 43,
    "series_id": 388,
    "images": [172798, 172799, 172801, ...]
  }
]
```

- **Поля**:
  - `id` — уникальный идентификатор автомобиля
  - `carname` — название автомобиля 
  - `year` — год выпуска
  - `mileage` — пробег
  - `price` — цена
  - `delivery_price` — цена с доставкой
  - `description` — описание (HTML)
  - `thumbnail` — id изображения (основное фото)
  - `condition` — состояние (например, "NEW")
  - `transmission` — тип трансмиссии
  - `fuel_type` — тип топлива
  - `car_type` — тип кузова
  - `vin` — VIN номер
  - `color` — цвет
  - `acceleration` — разгон до 100 км/ч
  - `engine_volume` — объем двигателя
  - `brand_id` — id бренда
  - `series_id` — id серии
  - `images` — массив id изображений

---

## 4. Связи между сущностями

- **Бренд** ↔ **Серии**: Один бренд может иметь несколько серий (`brands.series` — массив id серий).
- **Серия** ↔ **Бренд**: Каждая серия относится к одному бренду (`series.series_brand_id`).
- **Автомобиль** ↔ **Бренд/Серия**: Автомобиль содержит `brand_id` и `series_id` для связи с соответствующими сущностями.

---

## 5. Примечания

- Для получения изображений используйте отдельный endpoint Directus для файлов по id из массива `images` или поля `thumbnail`.
- Для фильтрации, сортировки и пагинации используйте стандартные query-параметры Directus API (`filter`, `sort`, `limit`, `offset` и т.д.).

---

Если нужно добавить примеры фильтрации, получения изображений или другие endpoints — дай знать, Andrew. 