import { useMutation } from '@tanstack/react-query';
import { Api } from '@/services/api-client';

interface GenerateXmlResponse {
  xml: string;
  fileName: string;
  localPath: string;
}

interface GenerateCsvResponse {
  csv: string;
  fileName: string;
  localPath: string;
}

interface GenerateTxtResponse {
  txt: string;
  fileName: string;
  localPath: string;
}

interface GenerateXlsxResponse {
  xlsx: string;
  fileName: string;
  localPath: string;
}

export const useGenerateXml = () =>
  useMutation<GenerateXmlResponse, Error, string>({
    mutationFn: async (filename: string) => {
      const response = await Api.tauri.saveTauriXml({ filename });
      return response.data;
    },
  });

export const useGenerateCsv = () =>
  useMutation<GenerateCsvResponse, Error, string>({
    mutationFn: async (filename: string) => {
      const response = await Api.tauri.saveTauriCsv({ filename });
      return response.data;
    },
  });

export const useGenerateTxt = () =>
  useMutation<GenerateTxtResponse, Error, string>({
    mutationFn: async (filename: string) => {
      const response = await Api.tauri.saveTauriTxt({ filename });
      return response.data;
    },
  });

export const useGenerateXlsx = () =>
  useMutation<GenerateXlsxResponse, Error, string>({
    mutationFn: async (filename: string) => {
      const response = await Api.tauri.saveTauriXlsx({ filename });
      return response.data;
    },
  });
