import { nomenclatureApi } from '@/api/interceptors';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useNomenclature = () => {
  return useQuery({
    queryKey: ['nomenclature'],
    queryFn: () => nomenclatureApi.getAll().then((res) => res.data),
  });
};

export const useNomenclatureItem = (id: string) => {
  return useQuery({
    queryKey: ['nomenclature', id],
    queryFn: () => nomenclatureApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCreateNomenclature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => nomenclatureApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nomenclature'] });
      toast.success('Номенклатура успешно создана');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка при создании номенклатуры');
    },
  });
};

export const useUpdateNomenclature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => nomenclatureApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['nomenclature'] });
      queryClient.invalidateQueries({ queryKey: ['nomenclature', variables.id] });
      toast.success('Номенклатура успешно обновлена');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка при обновлении номенклатуры');
    },
  });
};
