import { Api } from '@/services/api-client';
import type { AgentList, FileItem } from '@/services/shipment.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetch } from '@tauri-apps/plugin-http';
import { useCallback, useMemo, useState } from 'react';

export function useGetAgents() {
  const { data, isLoading } = useQuery({
    queryKey: ['gtin'],
    queryFn: () => Api.shipment.getGtins(),
  });

  return { data, isLoading };
}

export function useGetReportsForAgent(gtin: string[]) {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['agents', gtin],
    queryFn: () => Api.shipment.getReportsForAgent(gtin),
    enabled: !!gtin,
  });

  return { data, isLoading, isSuccess };
}

type CodeRow = {
  code: string;
  boxLabel?: string | null;
  palletLabel?: string | null;
};

export const useGetReportCodes = () => {
  return useMutation({
    mutationFn: async (gtin: string): Promise<CodeRow[]> => {
      const res = await fetch(`http://localhost:4000/api/shipment/report-codes/${gtin}`);
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

export const useFiles = () => {
  return useQuery<FileItem[]>({
    queryKey: ['files'],
    queryFn: Api.shipment.filesService,
    enabled: false,
  });
};

export const useFinalizeShipmentFile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (fileName: string) => Api.shipment.shipmentsFile(fileName),

    onSuccess: (data) => {
      // 1️⃣ Обновляем список файлов
      qc.invalidateQueries({ queryKey: ['files'] });

      // 2️⃣ Показываем уведомление
      toast(
        // title: 'Файл финализирован',
        `Добавлено ${data.labelsCount} кодов.`,
      );
    },

    onError: (err: any) => {
      toast(
        // title: 'Ошибка',
        err?.message || 'Не удалось финализировать файл',
      );
    },
  });
};

export const useAgentSearchList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Загружаем всех агентов
  const {
    data: agentsList,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['agents'],
    queryFn: () => Api.shipment.postAgentsList(),
    staleTime: 5 * 60 * 1000,
  });

  const agents = agentsList?.agents_list || [];

  const filteredAgents = useMemo(() => {
    if (!searchTerm.trim()) {
      return agents;
    }

    const lowerTerm = searchTerm.toLowerCase();
    return agents.filter((agent) => {
      return (
        agent.name.toLowerCase().includes(lowerTerm) ||
        agent.unp.toLowerCase().includes(lowerTerm) ||
        agent.gln.toLowerCase().includes(lowerTerm) ||
        (agent.address && agent.address.toLowerCase().includes(lowerTerm)) ||
        (agent.country?.name && agent.country.name.toLowerCase().includes(lowerTerm))
      );
    });
  }, [agents, searchTerm]);

  // Функция для сброса поиска
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Функция для поиска агента по ID
  const getAgentById = useCallback(
    (id: number): AgentList | undefined => {
      return agents.find((agent) => agent.id === id);
    },
    [agents],
  );

  return {
    agents,
    filteredAgents,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    refetch,
    clearSearch,
    getAgentById,
  };
};
