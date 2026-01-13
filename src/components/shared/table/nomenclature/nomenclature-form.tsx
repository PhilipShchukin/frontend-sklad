import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui';
import { DatePickerField } from '@/components/shared/date-picker-field';

import type { Counterparty } from '../counterparties/counterparties-list';

import { fetch } from '@tauri-apps/plugin-http';
import type { Nomenclature } from './nomenclature-list';

interface NomenclatureFormProps {
  mode: 'create' | 'edit';
  id?: string;
  onCancel: () => void;
}

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// const API_URL = 'http://localhost:4000/api';

const NomenclatureForm: React.FC<NomenclatureFormProps> = ({ mode, id, onCancel }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    displayName: '',
    productBarcode: '',
    volume: '',
    egaisCode: '',
    externalCode: '',
    expirationDate: 'Не ограничен',
    alcoholPercent: '',
    contractorId: '',
    labelBox: '',
    labelPallet: '',
    adInfo1: '',
    adInfo2: '',
  });
  // const { data: nomenclatureItem, isLoading: isLoadingNomenclature } = useNomenclatureItem(
  //   id || '',
  // );
  const [nomenclatureItem, setNomenclatureItem] = useState<Nomenclature>();

  const fetchNomenclatureItem = async () => {
    const res = await fetch(API_URL + `/table/nomenkulature-find-one/${id}`, {
      method: 'GET',
    });

    const data: Nomenclature = await res.json();
    setNomenclatureItem(data);
  };
  console.log('nomenclatureItem', nomenclatureItem);

  // const { data: counterpartiesData } = useCounterparties();

  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);

  const fetchReports = async () => {
    const res = await fetch(API_URL + '/table/agent-find-all');

    const data: Counterparty[] = await res.json();
    setCounterparties(data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    // Загружаем контрагентов и номенклатуру
    fetchReports();

    if (mode === 'edit' && id) {
      fetchNomenclatureItem();
    }
  }, [mode, id]);

  // Заполняем форму только после того, как nomenclatureItem загрузился
  useEffect(() => {
    if (mode === 'edit' && nomenclatureItem) {
      setFormData({
        code: nomenclatureItem.code || '',
        name: nomenclatureItem.name || '',
        displayName: nomenclatureItem.displayName || '',
        productBarcode: nomenclatureItem.productBarcode || '',
        volume: nomenclatureItem.volume?.toString() || '',
        egaisCode: nomenclatureItem.egaisCode || '',
        externalCode: nomenclatureItem.externalCode || '',
        expirationDate: nomenclatureItem.expirationDate
          ? new Date(nomenclatureItem.expirationDate).toISOString().split('T')[0]
          : '',
        alcoholPercent: nomenclatureItem.alcoholPercent?.toString() || '',
        contractorId: nomenclatureItem.contractorId || '',
        labelBox: nomenclatureItem.labelBox || '',
        labelPallet: nomenclatureItem.labelPallet || '',
        adInfo1: nomenclatureItem.adInfo1 || '',
        adInfo2: nomenclatureItem.adInfo2 || '',
      });
    }
  }, [nomenclatureItem, mode]);
  // const createMutation = useCreateNomenclature();
  // const updateMutation = useUpdateNomenclature();

  useEffect(() => {
    if (mode === 'edit' && nomenclatureItem) {
      setFormData({
        code: nomenclatureItem.code,
        name: nomenclatureItem.name,
        displayName: nomenclatureItem.displayName,
        productBarcode: nomenclatureItem.productBarcode,
        volume: nomenclatureItem.volume?.toString(),
        egaisCode: nomenclatureItem.egaisCode,
        externalCode: nomenclatureItem.externalCode || '',
        expirationDate: nomenclatureItem.expirationDate
          ? new Date(nomenclatureItem.expirationDate).toISOString().split('T')[0]
          : '',
        alcoholPercent: nomenclatureItem.alcoholPercent?.toString(),
        contractorId: nomenclatureItem.contractorId || '',
        labelBox: nomenclatureItem.labelBox || '',
        labelPallet: nomenclatureItem.labelPallet || '',
        adInfo1: nomenclatureItem.adInfo1 || '',
        adInfo2: nomenclatureItem.adInfo2 || '',
      });
    }
  }, [nomenclatureItem, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      expirationDate: date ? date.toISOString().split('T')[0] : '',
    }));
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const data = {
  //     code: formData.code,
  //     name: formData.name,
  //     displayName: formData.displayName,
  //     productBarcode: formData.productBarcode,
  //     volume: String(formData.volume),
  //     egaisCode: formData.egaisCode,
  //     externalCode: formData.externalCode,
  //     expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : '',
  //     alcoholPercent: String(formData.alcoholPercent),
  //     contractorId: formData.contractorId || '',
  //     labelBox: formData.labelBox || '',
  //     labelPallet: formData.labelPallet || '',
  //     adInfo1: formData.adInfo1 || '',
  //     adInfo2: formData.adInfo2 || '',
  //   };

  //   try {
  //     if (mode === 'edit' && id) {
  //       await updateMutation.mutateAsync({ id, data });

  //     } else {
  //       await createMutation.mutateAsync(data);

  //     }
  //      onCancel(); // Возвращаемся к списку после сохранения
  //   } catch (error) {
  //     console.error('Error saving nomenclature:', error);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      code: formData.code,
      name: formData.name,
      displayName: formData.displayName,
      productBarcode: formData.productBarcode,
      volume: String(formData.volume),
      egaisCode: formData.egaisCode,
      externalCode: formData.externalCode,
      expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : null,
      alcoholPercent: String(formData.alcoholPercent),
      contractorId: formData.contractorId || null,
      labelBox: formData.labelBox || '',
      labelPallet: formData.labelPallet || '',
      adInfo1: formData.adInfo1 || '',
      adInfo2: formData.adInfo2 || '',
    };

    try {
      let res;

      // ✅ РЕЖИМ РЕДАКТИРОВАНИЯ
      if (mode === 'edit' && id) {
        res = await fetch(`${API_URL}/table/nomenkulature-update/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }

      // ✅ РЕЖИМ СОЗДАНИЯ
      else {
        res = await fetch(`${API_URL}/table/nomenkulature-create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }

      const result = await res.json();
      console.log('✅ Успешный ответ сервера:', result);

      onCancel(); // ✅ Возврат к списку после сохранения
    } catch (error) {
      console.error('❌ Ошибка сохранения номенклатуры:', error);
    }
  };

  const volumeOptions = [
    { value: '0.2', label: '0.2 л' },
    { value: '0.5', label: '0.5 л' },
    { value: '1', label: '1 л' },
    { value: '2', label: '2 л' },
  ];

  const contractorOptions =
    counterparties?.map((contractor) => ({
      value: contractor.id,
      label: contractor.name,
    })) || [];

  const onClear = () => {
    setFormData({
      code: '',
      name: '',
      displayName: '',
      productBarcode: '',
      volume: '',
      egaisCode: '',
      externalCode: '',
      expirationDate: '',
      alcoholPercent: '',
      contractorId: '',
      labelBox: '',
      labelPallet: '',
      adInfo1: '',
      adInfo2: '',
    });
  };

  if (mode === 'edit' && !nomenclatureItem) {
    return <div className="p-6 text-center">Загрузка данных...</div>;
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
        <Card>
          <CardContent className="space-y-4">
            {/* Первая строка: Код, Крепость */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* <div className="space-y-2">
                <Label htmlFor="code">Код</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Введите код"
                />
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Введите название"
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alcoholPercent" className="flex items-center gap-2">
                  Крепость
                </Label>
                <Input
                  id="alcoholPercent"
                  value={formData.alcoholPercent}
                  onChange={handleChange}
                  placeholder="Введите крепость"
                />
              </div>
            </div>

            {/* Вторая строка: Название, Название для отображения */}
            {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Введите название"
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Название для отображения</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Введите название для отображения"
                />
              </div>
            </div> */}

            {/* Третья строка: Штрихкод продукции, Срок годности */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="productBarcode">Штрихкод продукции</Label>
                <Input
                  id="productBarcode"
                  value={formData.productBarcode}
                  onChange={handleChange}
                  placeholder="Введите штрихкод"
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiration" className="flex items-center gap-2">
                  Срок годности
                </Label>
                <Input
                  id="expirationDate"
                  // defaultValue={'Не ограничен'}
                  readOnly
                  value={formData.expirationDate}
                  onChange={handleChange}
                  placeholder="Введите срок годности"
                  className="font-mono"
                />
                {/* <DatePickerField
                  value={formData.expirationDate ? new Date(formData.expirationDate) : undefined}
                  onChange={handleDateChange}
                  label=""
                /> */}
              </div>
            </div>

            {/* Четвертая строка: Код в ЕГАИС, Внешний код */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="egaisCode">Код в ЕГАИС</Label>
                <Input
                  id="egaisCode"
                  value={formData.egaisCode}
                  onChange={handleChange}
                  placeholder="Введите код ЕГАИС"
                  className="font-mono"
                />
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="externalCode">Внешний код</Label>
                <Input
                  id="externalCode"
                  value={formData.externalCode}
                  onChange={handleChange}
                  placeholder="Введите внешний код"
                />
              </div> */}
            </div>

            {/* Пятая строка: Контрагент, Объём тары */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contractor" className="flex items-center gap-2">
                  Контрагент
                </Label>
                <Select
                  value={formData.contractorId}
                  onValueChange={(value) => handleSelectChange('contractorId', value)}
                >
                  <SelectTrigger id="contractor" className="min-w-[300px]">
                    <SelectValue placeholder="Выберите контрагента" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="volume">Объём тары</Label>
                <Select
                  value={formData.volume}
                  onValueChange={(value) => handleSelectChange('volume', value)}
                >
                  <SelectTrigger id="volume" className="min-w-[200px]">
                    <SelectValue placeholder="Выберите объём" />
                  </SelectTrigger>
                  <SelectContent>
                    {volumeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="labelBox">labelBox</Label>
                <Input
                  id="labelBox"
                  value={formData.labelBox}
                  onChange={handleChange}
                  placeholder="Введите labelBox"
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="labelPallet">labelPallet</Label>
                <Input
                  id="labelPallet"
                  value={formData.labelPallet}
                  onChange={handleChange}
                  placeholder="Введите внешний код"
                />
              </div>
            </div>

            {/* Дополнительная информация */}
            <div className="space-y-2">
              <Label htmlFor="adInfo1">Дополнительная информация</Label>
              <Textarea
                id="adInfo1"
                value={formData.adInfo1}
                onChange={handleChange}
                placeholder="Введите дополнительную информацию..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adInfo2">Дополнительная информация 2</Label>
              <Textarea
                id="adInfo2"
                value={formData.adInfo2}
                onChange={handleChange}
                placeholder="Введите дополнительную информацию..."
                className="min-h-[100px]"
              />
            </div>

            {/* Кнопки */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={onClear}
                // disabled={createMutation.isPending || updateMutation.isPending}
              >
                <X className="mr-2 h-4 w-4" />
                Отмена
              </Button>
              <Button
                onClick={handleSubmit}
                // disabled={createMutation.isPending || updateMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {/* {createMutation.isPending || updateMutation.isPending
                  ? 'Сохранение...'
                  : 'Сохранить'} */}
                {'Сохранить'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NomenclatureForm;
