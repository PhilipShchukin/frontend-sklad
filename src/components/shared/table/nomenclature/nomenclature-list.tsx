import React, { useEffect, useState } from 'react';

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

export interface Nomenclature {
  id: string;
  code: string;

  name: string;

  displayName: string;

  productBarcode: string;

  volume: string;

  egaisCode: string;

  externalCode?: string;

  expirationDate?: Date;

  alcoholPercent: string;

  contractorId?: string;

  labelBox?: string;

  labelPallet?: string;

  adInfo1?: string;

  adInfo2?: string;
}

const API_URL = 'http://localhost:4000/api';

interface NomenclatureListProps {
  onEdit: (id: string) => void;
}

const NomenclatureList: React.FC<NomenclatureListProps> = ({ onEdit }) => {
  const [nomenclature, setNomenclature] = useState<Nomenclature[]>([]);
  const [error, setError] = useState<string | null>(null);

  console.log('nomenclature-NomenclatureList', nomenclature);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_URL}/table/nomenkulature-delete/${id}`, {
        method: 'DELETE',
      });

      setNomenclature((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('❌ Ошибка удаления:', err);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API_URL}/table/nomenkulature-find-all`);

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data: Nomenclature[] = await res.json();
      setNomenclature(data);
    } catch (err) {
      console.error('❌ Ошибка загрузки номенклатуры:', err);
      setError('Ошибка загрузки номенклатуры');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="container mx-auto p-6">
      {error && <div className="text-destructive mb-4">{error}</div>}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Код</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Штрихкод</TableHead>
              <TableHead>Объем</TableHead>
              <TableHead>Крепость</TableHead>
              <TableHead>Контрагент</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nomenclature?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <Badge variant="secondary">{item.code}</Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-muted-foreground text-sm">{item.displayName}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm">{item.productBarcode}</code>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{item.volume} л</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.alcoholPercent}%</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  {item.name ? (
                    <Badge variant="secondary">{item.name}</Badge>
                  ) : (
                    <span className="text-muted-foreground">Не указан</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(item.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {/* </Link> */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(item.id)}
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
    </div>
  );
};

export default NomenclatureList;
