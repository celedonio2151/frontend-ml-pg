import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { useAuthStore } from 'modules/auth/stores/auth.store';
import { env } from 'shared/config/env';
import { ApiError, type ApiErrorResponse } from 'shared/lib/api-error';
import type { ApiResponse } from 'shared/types/api-reponse';

export const httpClient = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'es',
  },
  timeout: 30000,
});

httpClient.interceptors.request.use((config) => {
  const { tokens } = useAuthStore.getState();

  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const url = error.config?.url || '';

    // El backend respondió con el formato estándar de error.
    if (error.response?.data) {
      const apiError = new ApiError(error.response.data);

      if (apiError.isUnauthorized) {
        useAuthStore.getState().clearSession();
      }

      throw apiError;
    }

    // Sin respuesta del servidor (timeout, red, CORS).
    throw new ApiError({
      success: false,
      method: error.config?.method?.toUpperCase() ?? 'GET',
      status: 'NETWORK_ERROR',
      statusCode: error.response?.status ?? 0,
      path: url,
      timestamp: new Date().toISOString(),
      message: error.message || 'Error de conexión',
    });
  },
);

/**
 * Helpers tipados que desempaquetan el `data` de la respuesta estándar
 * (`ApiResponse<T>`) y devuelven directamente el payload `T`.
 * Si la llamada falla, lanzan un `ApiError`.
 */
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    httpClient.get<ApiResponse<T>>(url, config).then((response) => response.data.data),

  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    httpClient.post<ApiResponse<T>>(url, body, config).then((response) => response.data.data),

  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    httpClient.put<ApiResponse<T>>(url, body, config).then((response) => response.data.data),

  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    httpClient.patch<ApiResponse<T>>(url, body, config).then((response) => response.data.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    httpClient.delete<ApiResponse<T>>(url, config).then((response) => response.data.data),
} as const;
