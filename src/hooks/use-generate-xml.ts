import { useMutation } from '@tanstack/react-query';
import { Api } from '@/services/api-client';
import axios from 'axios';

// export function useGenerateXml() {
//   return useMutation({
//     mutationFn: async () => {
//       const response = await axios.post("http://localhost:4000/api/device-sync/xml?download=true", null, {
//         responseType: "blob",
//       });
//       return response;
//     },
//   });
// }

// export const useGenerateXml = () =>
//   useMutation({
//     mutationFn: (filename: string) =>
//       axios
//         .post('http://localhost:4000/api/device-sync/xml?download=true', filename)
//         .then((res) => res.data),
//   });

// hooks/use-generate-xml.ts

interface GenerateXmlResponse {
  xml: string;
  fileName: string;
  localPath: string;
}

export const useGenerateXml = () =>
  useMutation<GenerateXmlResponse, Error, string>({
    mutationFn: async (filename: string) => {
      // Важно: передаем filename в теле запроса как объект
      const response = await axios.post<GenerateXmlResponse>(
        'http://localhost:4000/api/device-sync/xml?download=true',
        { filename }, // оборачиваем в объект
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    },
  });
