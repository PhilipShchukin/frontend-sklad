import type { AxiosAdapter, AxiosResponse } from 'axios';
import { fetch as tauriFetch } from '@tauri-apps/plugin-http';

const axiosTauriApiAdapter: AxiosAdapter = async (config) => {
  const { url = '', method = 'get', data, params, headers = {}, baseURL } = config;

  const fullUrl = baseURL ? baseURL + url : url;

  const finalUrl = params ? fullUrl + '?' + new URLSearchParams(params as any).toString() : fullUrl;

  // Если data строка — НЕ сериализуем
  const body = typeof data === 'string' ? data : data ? JSON.stringify(data) : undefined;

  const res = await tauriFetch(finalUrl, {
    method: method.toUpperCase(),
    headers,
    body,
  });

  // Convert Headers -> plain object
  const plainHeaders: Record<string, string> = {};
  res.headers.forEach((v, k) => (plainHeaders[k] = v));

  // Parse body
  const text = await res.text();
  let bodyData: any;
  try {
    bodyData = JSON.parse(text);
  } catch {
    bodyData = text;
  }

  const axiosRes: AxiosResponse = {
    data: bodyData,
    status: res.status,
    statusText: res.statusText ?? '',
    headers: plainHeaders,
    config,
    request: null,
  };

  // return axiosRes;

  // 🔥 КЛЮЧЕВОЙ ФИКС
  if (res.status >= 200 && res.status < 300) {
    return axiosRes; // ✅ success
  }

  // ❌ error → axios onError
  return Promise.reject({
    ...axiosRes,
    isAxiosError: true,
  });
};

export default axiosTauriApiAdapter;
