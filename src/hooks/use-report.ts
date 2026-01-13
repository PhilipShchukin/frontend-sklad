import { Api } from '@/services/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  AllPalletsForBox,
  ChangePalletStatus,
  ChangeStatus,
  DeleteBox,
  DeletePallet,
  MoveBoxPayload,
  Report,
} from '@/types/pages-types/report-types';
import { toast } from 'sonner';

export function useGetReport() {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['report'],
    queryFn: () => Api.report.getAllReport(),
  });
  console.log('useGetReport', data);
  return { data, isLoading, isSuccess };
}

export const usePushReportDB = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Report) => Api.report.pushReportDB(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report'] });
      // toast('Отчет добавлен в базу');
      toast.success('Отчет добавлен в базу');
    },
    onError: (error: Error) => {
      toast.error(error.message);
      // toast.error(error.message);
      // toast.error('Отчет не добавлен в базу');
    },
  });
};

export const useMoveCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MoveBoxPayload) => Api.report.moveCode(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report'] });
      toast.success('Коробка перемещена');
    },
    onError: (error: Error) => {
      // toast.error(error.message);
      toast.error('Коробка не перемещен');
    },
  });
};

export const usePalletsAll = (boxNumber?: number, reportId?: string) => {
  const query = useQuery({
    queryKey: ['pallets', boxNumber, reportId],
    queryFn: async () => {
      if (!boxNumber || !reportId) return [];
      const { data } = await Api.report.PalletsAll({ boxNumber, reportId });
      return data; // массив допустимых паллет
    },
    enabled: false, // не выполнять автоматически
  });

  return query;
};

export const useChangeStatusBox = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ChangeStatus) => Api.report.changeStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['box'] });
      toast.success('Статус коробки изменен');
    },
    onError: (error: Error) => {
      toast.error(error.message);
      // toast.error('Коробка не перемещен');
    },
  });
};

export const useGetStatusBox = (boxNumber?: number, reportId?: string) => {
  console.log(boxNumber);
  const query = useQuery({
    queryKey: ['box', boxNumber, reportId],
    queryFn: async () => {
      if (!boxNumber || !reportId) return [];
      const { data } = await Api.report.getBoxStatus({ boxNumber, reportId });
      console.log('useGetStatusBox', data);
      return data;
    },
    enabled: false, // не выполнять автоматически
  });

  return query;
};

export const useDeletePalleteForBox = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AllPalletsForBox) => Api.report.deletePalleteForBox(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['box'] });
      toast.success('Коробка без паллеты');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useChangeStatusPallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChangePalletStatus) => Api.report.changePalletStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pallet'] });
      toast.success('Статус коробки изменен');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUnpackPallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { palletNumber: number; reportId: string }) =>
      Api.report.unpackPallet(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report', 'pallet'] });
      toast.success('Паллета расформирована');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUnpackBox = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { boxNumber: number; reportId: string }) => Api.report.unpackBox(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report', 'box'] });
      toast.success('Коробка расформирована');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeletePallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeletePallet) => Api.report.deletePallete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pallet'] });
      toast.success('Паллета удалена');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
export const useDeleteBox = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteBox) => Api.report.deleteBox(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['box'] });
      toast.success('Коробка удалена');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
