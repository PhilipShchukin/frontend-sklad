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
  ReportGet,
} from '@/types/pages-types/report-types';
import { toast } from 'sonner';

import axios from 'axios';

export const getAxiosErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (Array.isArray(data?.message)) {
      return data.message.join('\n');
    }

    if (typeof data?.message === 'string') {
      return data.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Произошла неизвестная ошибка';
};

export const parseApiError = (
  error: unknown,
): {
  type: 'dto' | 'business' | 'server' | 'unknown';
  message: string;
  messages?: string[];
} => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    const status = error.response?.status;

    if (status === 400 && Array.isArray(data?.message)) {
      return {
        type: 'dto',
        message: 'Ошибка валидации данных',
        messages: data.message,
      };
    }

    if (typeof data?.message === 'string') {
      return {
        type: 'business',
        message: data.message,
      };
    }

    // fallback
    return {
      type: 'server',
      message: 'Ошибка сервера',
    };
  }

  if (error instanceof Error) {
    return {
      type: 'unknown',
      message: error.message,
    };
  }

  return {
    type: 'unknown',
    message: 'Неизвестная ошибка',
  };
};

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
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Отчет создан. Маркировка выполняется');
    },

    onError: (error) => {
      console.log('error', error);
      const parsed = parseApiError(error);

      if (parsed.type === 'dto' && parsed.messages) {
        parsed.messages.forEach((msg) => {
          toast.error(msg);
        });
        return;
      }

      toast.error(parsed.message);
    },
  });
};

export const usePushPortal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReportGet) => Api.report.pushPortal(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal'] });
      toast.success('Отчет отправлен');
    },

    onError: (error) => {
      toast.error(error.message);
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
      return data;
    },
    enabled: false,
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
    enabled: false,
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
