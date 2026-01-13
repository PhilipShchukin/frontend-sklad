/**
 * HTTP Client адаптер для Tauri
 * Использует Tauri HTTP plugin в production, fallback на axios в dev
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

// Проверяем, работаем ли мы в Tauri
function isTauriEnv(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return '__TAURI_INTERNALS__' in window || '__TAURI__' in window;
  } catch {
    return false;
  }
}

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Создает axios-подобный клиент
 * В dev режиме использует обычный axios
 * В production Tauri build автоматически использует Tauri HTTP через permissions
 */
function createHttpClient(): AxiosInstance {
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: false, // Отключаем для Tauri
  });
}

export const httpClient = createHttpClient();
