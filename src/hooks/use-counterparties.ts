import { counterpartiesApi } from '@/api/interceptors';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCounterparties = () => {
  return useQuery({
    queryKey: ['counterparties'],
    queryFn: () => counterpartiesApi.getAll().then((res) => res.data),
  });
};

export const useCounterparty = (id: string) => {
  return useQuery({
    queryKey: ['counterparty', id],
    queryFn: () => counterpartiesApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCreateCounterparty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => counterpartiesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counterparties'] });
      toast.success('Контрагент успешно создан');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка при создании контрагента');
    },
  });
};

export const useUpdateCounterparty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => counterpartiesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['counterparties'] });
      queryClient.invalidateQueries({ queryKey: ['counterparty', variables.id] });
      toast.success('Контрагент успешно обновлен');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка при обновлении контрагента');
    },
  });
};
