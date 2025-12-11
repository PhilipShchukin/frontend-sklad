import { ApiRoutesShipment } from './constants';
import { axiosClassic } from '@/api/interceptors';

export interface GetReportsForAgent {
  id: string;
  startDate: string;
  endDate: string;
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

export const getAgents = async (): Promise<string[]> => {
  return (await axiosClassic.get(ApiRoutesShipment.SHIPMENT_AGENT)).data;
};

export const getReportsForAgent = async (agent: string): Promise<GetReportsForAgent[]> => {
  const response = await axiosClassic.post(ApiRoutesShipment.SHIPMENT_REPORT, { agent });
  return response.data;
};

// export const createShipmentTask = async (): Promise<any> => {
//   return (await axiosClassic.post(ApiRoutes.SHIPMENT_TASK)).data;
// };
