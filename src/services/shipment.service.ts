import { ApiRoutes } from './constants';
import { axiosClassic } from '@/api/interceptors';
export type ShipmentGet = {
  gtin: string;
  name: string;
};

// export type ShipmentStockByGtin = Omit<ShipmentGet, 'name'> & {
//   count: string;
// };
export type Ship = {
  gtin: string;
  count: string;
};

export interface Country {
  code: string;
  name: string;
  comment?: string | null;
}

export interface Status {
  code: number;
  message: string;
}

export interface Agent {
  id: number;
  name: string;
  unp: string;
  country: Country;
  address?: string;
  gln?: string;
  status?: Status;
  is_verified?: boolean;
}

export interface AgentsResponse {
  agents_list: Agent[];
}

export const getProducts = async (): Promise<ShipmentGet[]> => {
  return (await axiosClassic.get(ApiRoutes.SHIPMENT)).data;
};

export const getStockByGtin = async (gtin: string): Promise<Ship> => {
  return (await axiosClassic.post(ApiRoutes.SHIPMENT_STOCK, { gtin })).data;
};

export const getAgentsList = async (): Promise<AgentsResponse> => {
  return (await axiosClassic.post(ApiRoutes.DATA)).data;
};

export const createShipmentTask = async (): Promise<any> => {
  return (await axiosClassic.post(ApiRoutes.SHIPMENT_TASK)).data;
};
