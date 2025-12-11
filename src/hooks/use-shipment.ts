import { Api } from '@/services/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useGetAgents() {
  const { data, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: () => Api.shipment.getAgents(),
  });

  return { data, isLoading };
}

export function useGetReportsForAgent(agent: string) {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['agents', agent],
    queryFn: () => Api.shipment.getReportsForAgent(agent),
    enabled: !!agent,
  });

  return { data, isLoading, isSuccess };
}

type CodeRow = {
  code: string;
  boxLabel?: string | null;
  palletLabel?: string | null;
};

import { fetch } from '@tauri-apps/plugin-http';

export const useGetReportCodes = () => {
  return useMutation({
    mutationFn: async (reportId: string): Promise<CodeRow[]> => {
      const res = await fetch(`http://localhost:4000/api/shipment/report-codes/${reportId}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Ошибка загрузки кодов');
      }
      const data = await res.json();
      // ожидаем массив объектов { code, boxLabel, palletLabel }
      return data as CodeRow[];
    },
  });
};

// export const useShipmentByGtin = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (gtin: string) => Api.shipment.getStockByGtin(gtin),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['shipment'] });
//       toast.success('Коробка без паллеты');
//     },
//     onError: (error: Error) => {
//       toast.error(error.message);
//     },
//   });
// };

// export function useGetAgents() {
//   const { data, isLoading, isSuccess } = useQuery<AgentsResponse>({
//     queryKey: ['agents'],
//     queryFn: () => Api.shipment.getAgentsList(),
//   });

//   return { data, isLoading, isSuccess };
// }

// export const useCreateShipmentTask = () => {
//   return useMutation({
//     mutationFn: async (data: {
//       counterparty: string;
//       date: string;
//       products: { gtin: string; qty: number }[];
//     }) => {
//       const res = await axios.post('/api/shipment-task', data);
//       return res.data;
//     },
//   });
// };
// export const useCreateShipmentTask = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (payload: AllPalletsForBox) => Api.report.deletePalleteForBox(payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['box'] });
//       toast.success('Задание успешно создано');
//     },
//     onError: (error: Error) => {
//       toast.error(error.message);
//     },
//   });
// };
// export const useRefreshAgents = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: () => Api.shipment.getAgentsList(),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['agents'] });
//       toast.success('Данные агентов');
//     },
//     onError: (error: Error) => {
//       toast.error(error.message);
//     },
//   });
// };
