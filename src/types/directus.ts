// src/types/directus.ts

export interface Car {
  id: string;
  infoid: number;
  carname: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  thumbnail: string | null;
  images?: string[];
  date_created?: string;
  date_updated?: string;
  color?: string;
  engine_volume?: number;
  condition?: string;
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