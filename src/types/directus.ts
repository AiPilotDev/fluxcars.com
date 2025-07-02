// src/types/directus.ts

export interface Car {
  id: number;
  infoid: number;
  carname: string;
  model: string | null;
  year: number;
  mileage: number;
  price: number;
  delivery_price: number;
  description: string;
  thumbnail: string;
  condition: string;
  transmission: string;
  fuel_type: string;
  car_type: string;
  vin: string;
  color: string;
  acceleration: string;
  engine_volume: number | null;
  brand_id: { id: number; name: string };
  series_id: { id: number; seriesname: string };
  images: number[];
}

export interface DirectusResponse<T = unknown> {
  data: T[];
  meta: {
    total_count: number;
    filter_count: number;
  };
}

export interface DirectusError {
  errors: Array<{
    message: string;
    extensions: {
      code: string;
    };
  }>;
}

export interface Brand {
  id: number;
  name: string;
  series: number[];
}

export interface Series {
  id: number;
  seriesname: string;
  series_brand_id: number;
}