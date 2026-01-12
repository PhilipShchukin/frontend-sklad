import { axiosClassic } from '@/api/interceptors';
import { ApiRoutesTauri } from './constants';

export const saveTauriXml = async (data: any): Promise<any> => {
  return await axiosClassic.post(ApiRoutesTauri.SAVE_TAURI_XML, data);
};

export const saveTauriCsv = async (data: any): Promise<any> => {
  return await axiosClassic.post(ApiRoutesTauri.SAVE_TAURI_CSV, data);
};
