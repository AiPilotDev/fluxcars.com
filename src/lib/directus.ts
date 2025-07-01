// src/lib/directus.ts
import axios, { AxiosRequestConfig } from 'axios';
import { Car, DirectusResponse, Brand } from '@/types/directus';
import { formatError } from '@/utils/formatError';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
if (!DIRECTUS_URL) {
  throw new Error('NEXT_PUBLIC_DIRECTUS_URL is not defined');
}
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

interface GetCarsParams {
  limit?: number;
  page?: number;
  sort?: string;
  filter?: Record<string, unknown> | string;
  meta?: string;
}

// Кэш для API запросов
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

class DirectusAPI {
  private baseURL: string;
  private token?: string;

  constructor(baseURL: string, token?: string) {
    this.baseURL = baseURL;
    this.token = token;
  }

  private getCacheKey(endpoint: string, params: unknown): string {
    return `${endpoint}?${JSON.stringify(params)}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < CACHE_DURATION;
  }

  private async request<T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response = await axios({
        url: `${this.baseURL}${endpoint}`,
        ...options,
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('API request failed:', formatError(error));
      throw new Error(formatError(error));
    }
  }

  async getCars(params: GetCarsParams = {}): Promise<DirectusResponse<Car>> {
    try {
      const cacheKey = this.getCacheKey('/items/Cars', params);
      const cached = cache.get(cacheKey);
      
      if (cached && this.isCacheValid(cached.timestamp)) {
        return cached.data as DirectusResponse<Car>;
      }

      // Если есть фильтр, сериализуем его как JSON-строку
      const paramsToSend = { ...params };
      if (paramsToSend.filter) {
        paramsToSend.filter = JSON.stringify(paramsToSend.filter);
      }
      
      const response = await axios.get(`${this.baseURL}/items/Cars`, {
        params: paramsToSend
      });
      
      // Сохраняем в кэш
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching cars:', error);
      throw error;
    }
  }

  async getBrands(): Promise<DirectusResponse<Brand>> {
    try {
      const response = await axios.get(`${this.baseURL}/items/brands`, {
        params: { fields: 'id,name', sort: 'name', limit: 1000 }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  }

  getAssetUrl(assetId: string, params: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'inside' | 'outside';
    quality?: number;
    format?: 'auto' | 'jpg' | 'png' | 'webp';
  } = {}): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    return `${this.baseURL}/assets/${assetId}${queryString ? `?${queryString}` : ''}`;
  }
}

export const directusAPI = new DirectusAPI(DIRECTUS_URL, DIRECTUS_TOKEN);

// Утилиты для форматирования
export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
};

export async function fetchCars(params: unknown): Promise<DirectusResponse<Car>> {
  // Приводим параметры к типу GetCarsParams, если это объект
  const safeParams = typeof params === 'object' && params !== null ? params as GetCarsParams : {};
  return directusAPI.getCars(safeParams);
}

export async function fetchBrands(): Promise<DirectusResponse<Brand>> {
  return directusAPI.getBrands();
}