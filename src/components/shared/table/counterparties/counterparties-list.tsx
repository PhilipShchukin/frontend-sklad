// import React, { useEffect, useState } from 'react';
// import { Edit, Trash2 } from 'lucide-react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { counterpartiesApi } from '@/api/interceptors';

// interface Counterparty {
//   id: string;
//   code: string;
//   name: string;
//   displayName?: string;
//   exportFormat: string;
//   barcodeType: string;
//   fileNameFormat: string;
//   createdAt: string;
// }

// interface CounterpartiesListProps {
//   onEdit: (id: string) => void;
// }

// const CounterpartiesList: React.FC<CounterpartiesListProps> = ({ onEdit }) => {
//   // const { data: counterparties, isLoading } = useCounterparties();

//   // if (isLoading) {
//   //   return <div className="p-4">Загрузка контрагентов...</div>;
//   // }

//   const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCounterparties = async () => {
//       try {
//         setIsLoading(true);
//         // Вариант 1: если API возвращает Response
//         const response = await counterpartiesApi.getAll();

//         // Проверяем структуру ответа
//         console.log('API Response:', response);

//         // Если это стандартный Fetch Response
//         if (response && typeof response.json === 'function') {
//           const data = await response.json();
//           setCounterparties(data || []);
//         }
//         // Если это уже распарсенные данные
//         else if (Array.isArray(response)) {
//           setCounterparties(response);
//         }
//         // Если это объект с полем data
//         else if (response && response.data) {
//           setCounterparties(response.data || []);
//         }
//         // Если это другой формат
//         else {
//           setCounterparties([]);
//         }
//       } catch (err) {
//         setError('Ошибка при загрузке контрагентов');
//         console.error('Ошибка загрузки:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCounterparties();
//   }, []);

//   if (isLoading) {
//     return <div className="p-4">Загрузка контрагентов...</div>;
//   }

//   if (error) {
//     return <div className="text-destructive p-4">{error}</div>;
//   }

//   if (counterparties.length === 0) {
//     return <div className="p-4">Нет контрагентов</div>;
//   }

//   return (
//     <div className="rounded-lg border">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Код</TableHead>
//             <TableHead>Название</TableHead>
//             <TableHead>Формат выгрузки</TableHead>
//             <TableHead>Тип штрихкода</TableHead>
//             <TableHead>Формат имени файла</TableHead>
//             <TableHead>Дата создания</TableHead>
//             <TableHead className="text-right">Действия</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {counterparties.map((counterparty) => (
//             <TableRow key={counterparty.id}>
//               <TableCell className="font-medium">
//                 <Badge variant="secondary">{counterparty.code}</Badge>
//               </TableCell>
//               <TableCell>
//                 <div>
//                   <div className="font-medium">{counterparty.name}</div>
//                   {counterparty.displayName && (
//                     <div className="text-muted-foreground text-sm">{counterparty.displayName}</div>
//                   )}
//                 </div>
//               </TableCell>
//               <TableCell>
//                 <Badge variant="outline">{counterparty.exportFormat}</Badge>
//               </TableCell>
//               <TableCell>
//                 <Badge variant="outline">{counterparty.barcodeType}</Badge>
//               </TableCell>
//               <TableCell>
//                 <Badge variant="outline">{counterparty.fileNameFormat}</Badge>
//               </TableCell>
//               <TableCell>{new Date(counterparty.createdAt).toLocaleDateString('ru-RU')}</TableCell>
//               <TableCell className="text-right">
//                 <div className="flex justify-end gap-2">
//                   <Button variant="outline" size="sm" onClick={() => onEdit(counterparty.id)}>
//                     <Edit className="h-4 w-4" />
//                   </Button>
//                   <Button variant="outline" size="sm" className="text-destructive">
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default CounterpartiesList;

import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetch } from '@tauri-apps/plugin-http';

export interface Counterparty {
  id: string;
  code: string;
  name: string;
  displayName: string | null;
  exportFormat: string;
  barcodeType: string;
  fileNameFormat: string;
  lineNumber: string | null;
  contractorEgaisId: string | null;
  shipperEgaisId: string | null;
  shipperName: string | null;
  recipientEgaisId: string | null;
  recipientName: string | null;
  ssccExtension: string | null;
  gs1Code: string | null;
  additionalInfo: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CounterpartiesListProps {
  onEdit: (id: string) => void;
}
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const API_URL = 'http://localhost:4000/api';

const CounterpartiesList: React.FC<CounterpartiesListProps> = ({ onEdit }) => {
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    const res = await fetch(API_URL + '/table/agent-find-all');

    const data: Counterparty[] = await res.json();
    setCounterparties(data);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_URL}/table/agent-delete/${id}`, {
        method: 'DELETE',
      });

      setCounterparties((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('❌ Ошибка удаления:', err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // if (isLoading) {
  //   return <div className="p-4">Загрузка контрагентов...</div>;
  // }

  if (error) {
    return <div className="text-destructive p-4">{error}</div>;
  }

  if (counterparties.length === 0) {
    return <div className="p-4">Нет контрагентов</div>;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Код</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Формат выгрузки</TableHead>
            <TableHead>Тип штрихкода</TableHead>
            <TableHead>Формат имени файла</TableHead>
            <TableHead>Дата создания</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {counterparties.map((counterparty) => (
            <TableRow key={counterparty.id}>
              <TableCell className="font-medium">
                <Badge variant="secondary">{counterparty.code || '—'}</Badge>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{counterparty.name || '—'}</div>
                  {counterparty.displayName && (
                    <div className="text-muted-foreground text-sm">{counterparty.displayName}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{counterparty.exportFormat || '—'}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{counterparty.barcodeType || '—'}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{counterparty.fileNameFormat || '—'}</Badge>
              </TableCell>
              <TableCell>
                {counterparty.createdAt
                  ? new Date(counterparty.createdAt).toLocaleDateString('ru-RU')
                  : '—'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(counterparty.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(counterparty.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CounterpartiesList;
