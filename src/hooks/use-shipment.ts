import { Api } from '@/services/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  AllPalletsForBox,
  ChangeStatus,
  MoveBoxPayload,
  Report,
} from '@/types/pages-types/report-types';
import { toast } from 'sonner';
import type { AgentsResponse, ShipmentGet } from '@/services/shipment.service';

export function useGetShipment() {
  const { data, isLoading, isSuccess } = useQuery<ShipmentGet[]>({
    queryKey: ['shipment'],
    queryFn: () => Api.shipment.getProducts(),
  });

  return { data, isLoading, isSuccess };
}

export const useShipmentByGtin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gtin: string) => Api.shipment.getStockByGtin(gtin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipment'] });
      toast.success('Коробка без паллеты');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export function useGetAgents() {
  const { data, isLoading, isSuccess } = useQuery<AgentsResponse>({
    queryKey: ['agents'],
    queryFn: () => Api.shipment.getAgentsList(),
  });

  return { data, isLoading, isSuccess };
}

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
