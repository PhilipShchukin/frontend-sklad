import { ApiRoutes, ApiRoutesShipment } from './constants';
import { axiosClassic } from '@/api/interceptors';

export interface GetReportsForAgent {
  id: string;
  startDate: string;
  endDate: string;
  orderNumber: string;
  contractorEgaisId: string;
  gtin: string;
  agent: string;
  manufactureDate: string;
  bbd: string;
  batch: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  codesCount: number;
}
export interface ProductCount {
  gtin: string;
  count: number;
}
export interface FileItem {
  name: string;
  data: unknown;
}
export interface AgentList {
  id: number;
  name: string;
  unp: string;
  country: {
    code: string;
    name: string;
    comment: string | null;
  };
  address: string;
  gln: string;
  ogrn: null;
  kpp: null;
  status: {
    code: number;
    message: string;
  };
  is_verified: boolean;
}

export interface ApiResponseAgentList {
  agents_list: AgentList[];
}

export type FilesResponse = FileItem[];

export const getGtins = async (): Promise<string[]> => {
  return (await axiosClassic.get(ApiRoutesShipment.SHIPMENT_GTINS)).data;
};

export const postAgentsList = async (): Promise<ApiResponseAgentList> => {
  const ppp = (await axiosClassic.post(ApiRoutes.AGENTS_LIST)).data;
  return ppp;
};

export const getReportsForAgent = async (gtin: string[]): Promise<ProductCount[]> => {
  const response = await axiosClassic.post(ApiRoutesShipment.SHIPMENT_REPORT, { gtin });
  return response.data;
};
export const filesService = async (): Promise<FilesResponse> => {
  const { data } = await axiosClassic.get<FilesResponse>(ApiRoutesShipment.FIND_ALL);
  return data;
};

export const shipmentsFile = async (
  shipmentName: string,
): Promise<{ filePath: string; labelsCount: number }> => {
  const { data } = await axiosClassic.get(`${ApiRoutesShipment.LABUBU}/${shipmentName}`);
  return data;
};
