import axios, { type CreateAxiosDefaults } from 'axios';
import { fetch } from '@tauri-apps/plugin-http';
import axiosTauriApiAdapter from './axios-tauri-adapter';
// import axiosTauriApiAdapter from 'axios-tauri-api-adapter';
// const baseURL = 'http://localhost:4000/api';  `
const options: CreateAxiosDefaults = {
  adapter: axiosTauriApiAdapter,
  // baseURL: 'http://localhost:4000/api',
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

const axiosClassic = axios.create(options);

// Контрагенты API
export const counterpartiesApi = {
  getAll: () => axiosClassic.get('/table/agent-find-all'),
  getById: (id: string) => axiosClassic.get(`/table/agent-find-one/${id}`),
  getByCode: (code: string) => axiosClassic.get(`/table/agent-find-by-code/${code}`),
  create: (data: any) => axiosClassic.post('/table/agent-create', data),
  update: (id: string, data: any) => axiosClassic.patch(`/table/agent-update/${id}`, data),
  delete: (id: string) => axiosClassic.delete(`/table/agent-delete/${id}`),
};

// Номенклатура API
export const nomenclatureApi = {
  getAll: () => axiosClassic.get('/table/nomenkulature-find-all'),
  getById: (id: string) => axiosClassic.get(`/table/nomenkulature-find-one/${id}`),
  getByCode: (code: string) => axiosClassic.get(`/table/nomenkulature-find-by-code/${code}`),
  create: (data: any) => axiosClassic.post('/table/nomenkulature-create', data),
  update: (id: string, data: any) => axiosClassic.patch(`/table/nomenkulature-update/${id}`, data),
  delete: (id: string) => axiosClassic.delete(`/table/nomenkulature-delete/${id}`),
};

export { axiosClassic };
