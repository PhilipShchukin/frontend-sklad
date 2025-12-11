import { axiosClassic } from '@/api/interceptors';
import { ApiRoutesTauri, Status } from './constants';

export const saveTauri = async (data: any): Promise<any> => {
  return await axiosClassic.post(ApiRoutesTauri.SAVE_TAURI, data);
};
