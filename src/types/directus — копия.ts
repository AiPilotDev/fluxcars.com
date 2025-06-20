// src/types/directus.ts

export interface Car {
  id: string;
  carname: string;
  brand: string;
  model: string;
  price: number;
  thumbnail: string | null;
  date_created?: string;
  date_updated?: string;
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