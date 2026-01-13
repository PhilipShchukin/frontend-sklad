import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { Edit, Trash2, Plus, Barcode, Package, Droplets } from 'lucide-react';
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
import { useNomenclature } from '@/hooks/use-nomenclature';
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
  // const { data: nomenclature, isLoading } = useNomenclature();

  // if (isLoading) {
  //   return <div className="p-4">Загрузка номенклатуры...</div>;
  // }

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
      {/* <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Номенклатура</h1>
          <p className="text-muted-foreground">Управление номенклатурой</p>
        </div>
        <Link to="/nomenclature/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Новая номенклатура
          </Button>
        </Link>
      </div> */}
      {error && <div className="text-destructive mb-4">{error}</div>}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Код</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>
                {/* <Barcode className="h-4 w-4" /> */}
                Штрихкод
              </TableHead>
              <TableHead>
                {/* <Package className="h-4 w-4" /> */}
                Объем
              </TableHead>
              <TableHead>
                {/* <Droplets className="h-4 w-4" /> */}
                Крепость
              </TableHead>
              <TableHead>Контрагент</TableHead>
              {/* <TableHead>Дата создания</TableHead> */}
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
                    {/* <Barcode className="h-4 w-4" /> */}
                    <code className="font-mono text-sm">{item.productBarcode}</code>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {/* <Package className="h-4 w-4" /> */}
                    <span>{item.volume} л</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {/* <Droplets className="h-4 w-4" /> */}
                    <Badge variant="outline">{item.alcoholPercent}%</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  {item.contractorId ? (
                    <Badge variant="secondary">{item.contractorId}</Badge>
                  ) : (
                    <span className="text-muted-foreground">Не указан</span>
                  )}
                </TableCell>
                {/* <TableCell>{new Date(item.createdAt).toLocaleDateString('ru-RU')}</TableCell> */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* <Link to={`${API_URL}/table/nomenclature/${item.id}/edit`}> */}
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
