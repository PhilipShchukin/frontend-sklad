import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetch } from '@tauri-apps/plugin-http';

interface DeviceStatus {
  connected: boolean;
  message: string;
  filesCount: number;
  sampleFiles: string[];
  lastCheck: string;
}

interface SyncStats {
  filesProcessed: number;
  reportsUpdated: number;
  palletsUpdated: number;
  boxesUpdated: number;
  codesUpdated: number;
}

interface SyncResult {
  success: boolean;
  message: string;
  stats: SyncStats;
  errors: Array<{ file: string; error: string }>;
}

interface DbStats {
  reports: number;
  boxes: number;
  codes: number;
}

const API_BASE_URL = 'http://localhost:4000/api/device-sync';

const api = {
  checkDeviceStatus: async (): Promise<DeviceStatus> => {
    const response = await fetch(`${API_BASE_URL}/status`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return response.json();
  },

  startSync: async (): Promise<SyncResult> => {
    const response = await fetch(`${API_BASE_URL}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return response.json();
  },

  fetchDbStats: async (): Promise<{ success: boolean; message: string; stats: DbStats }> => {
    const response = await fetch(`${API_BASE_URL}/test-db`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return response.json();
  },
};

// React Query ключи
export const syncKeys = {
  all: ['sync'] as const,
  deviceStatus: () => [...syncKeys.all, 'deviceStatus'] as const,
  dbStats: () => [...syncKeys.all, 'dbStats'] as const,
  syncResult: () => [...syncKeys.all, 'syncResult'] as const,
};

export const useSync = () => {
  const queryClient = useQueryClient();

  const deviceStatusQuery = useQuery({
    queryKey: syncKeys.deviceStatus(),
    queryFn: api.checkDeviceStatus,
    refetchInterval: 30000,
    retry: 2,
  });

  const dbStatsQuery = useQuery({
    queryKey: syncKeys.dbStats(),
    queryFn: async () => {
      const result = await api.fetchDbStats();
      if (!result.success) throw new Error(result.message);
      return result.stats;
    },
    retry: 2,
  });

  // Мутация для запуска синхронизации
  const syncMutation = useMutation({
    mutationFn: api.startSync,
    onSuccess: (data) => {
      // Инвалидируем запросы после успешной синхронизации
      queryClient.invalidateQueries({ queryKey: syncKeys.dbStats() });

      // Сохраняем результат в кэш
      queryClient.setQueryData(syncKeys.syncResult(), data);
    },
    onError: (error) => {
      console.error('Sync error:', error);
    },
  });

  // Получение результата последней синхронизации из кэша
  const lastSyncResult = queryClient.getQueryData<SyncResult>(syncKeys.syncResult());

  // Функции для ручного обновления
  const refreshDeviceStatus = () => {
    queryClient.invalidateQueries({ queryKey: syncKeys.deviceStatus() });
  };

  const refreshDbStats = () => {
    queryClient.invalidateQueries({ queryKey: syncKeys.dbStats() });
  };

  const clearSyncResult = () => {
    queryClient.removeQueries({ queryKey: syncKeys.syncResult() });
  };

  return {
    // Запросы
    deviceStatusQuery,
    dbStatsQuery,
    syncMutation,

    // Данные
    deviceStatus: deviceStatusQuery.data,
    dbStats: dbStatsQuery.data,
    syncResult: syncMutation.data || lastSyncResult,

    // Состояния
    isLoading: deviceStatusQuery.isLoading || dbStatsQuery.isLoading || syncMutation.isPending,
    isDeviceLoading: deviceStatusQuery.isLoading,
    isDbLoading: dbStatsQuery.isLoading,
    isSyncing: syncMutation.isPending,
    error: deviceStatusQuery.error || dbStatsQuery.error || syncMutation.error,

    // Утилиты
    isDeviceConnected: deviceStatusQuery.data?.connected || false,
    filesCount: deviceStatusQuery.data?.filesCount || 0,
    hasErrors: syncMutation.data?.errors && syncMutation.data.errors.length > 0,

    // Функции
    startSync: syncMutation.mutate,
    refreshDeviceStatus,
    refreshDbStats,
    clearSyncResult,
  };
};
