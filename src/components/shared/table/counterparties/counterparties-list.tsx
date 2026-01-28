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
