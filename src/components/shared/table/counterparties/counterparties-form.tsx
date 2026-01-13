import React, { useState, useEffect } from 'react';
import {
  Save,
  X,
  FileText,
  Barcode,
  Hash,
  Building,
  FileInput,
  Type,
  HashIcon,
  Truck,
  User,
  Package,
  Globe,
  Info,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui';
import { fetch } from '@tauri-apps/plugin-http';

import {
  useCounterparty,
  useCreateCounterparty,
  useUpdateCounterparty,
} from '@/hooks/use-counterparties';

interface CounterpartiesFormProps {
  mode: 'create' | 'edit';
  id?: string;
  onCancel: () => void;
}
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// const API_URL = 'http://localhost:4000/api';

export interface counterparty {
  id: string;
  code: string;
  name: string | null;
  displayName: string | null;
  createdAt: Date;
  updatedAt: Date;
  exportFormat: string | null;
  barcodeType: string | null;
  fileNameFormat: string | null;
  lineNumber: string | null;
  contractorEgaisId: string | null;
  shipperEgaisId: string | null;
  shipperName: string | null;
  recipientEgaisId: string | null;
  recipientName: string | null;
  ssccExtension: string | null;
  gs1Code: string | null;
  additionalInfo: string | null;
}
const CounterpartiesForm: React.FC<CounterpartiesFormProps> = ({ mode, id, onCancel }) => {
  // const { data: counterparty, isLoading: isLoadingCounterparty } = useCounterparty(id || '');

  const [counterparty, setCounterparty] = useState<counterparty>();

  const fetchCounterparty = async () => {
    const res = await fetch(API_URL + `/table/agent-find-one/${id}`, {
      method: 'GET',
    });

    const data: counterparty = await res.json();
    setCounterparty(data);
  };

  useEffect(() => {
    // Загружаем контрагентов и номенклатуру
    // fetchReports();

    if (mode === 'edit' && id) {
      fetchCounterparty();
    }
  }, [mode, id]);

  // const createMutation = useCreateCounterparty();
  // const updateMutation = useUpdateCounterparty();

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    displayName: '',
    exportFormat: '',
    barcodeType: '',
    fileNameFormat: '',
    lineNumber: '',
    contractorEgaisId: '',
    shipperEgaisId: '',
    shipperName: '',
    recipientEgaisId: '',
    recipientName: '',
    ssccExtension: '',
    gs1Code: '',
    additionalInfo: '',
  });

  useEffect(() => {
    if (mode === 'edit' && counterparty) {
      setFormData({
        code: counterparty.code || '',
        name: counterparty.name || '',
        displayName: counterparty.displayName || '',
        exportFormat: counterparty.exportFormat || '',
        barcodeType: counterparty.barcodeType || '',
        fileNameFormat: counterparty.fileNameFormat || '',
        lineNumber: counterparty.lineNumber || '',
        contractorEgaisId: counterparty.contractorEgaisId || '',
        shipperEgaisId: counterparty.shipperEgaisId || '',
        shipperName: counterparty.shipperName || '',
        recipientEgaisId: counterparty.recipientEgaisId || '',
        recipientName: counterparty.recipientName || '',
        ssccExtension: counterparty.ssccExtension || '',
        gs1Code: counterparty.gs1Code || '',
        additionalInfo: counterparty.additionalInfo || '',
      });
    }
  }, [counterparty, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      code: formData.code,
      name: formData.name,
      displayName: formData.displayName || undefined,
      exportFormat: formData.exportFormat,
      barcodeType: formData.barcodeType,
      fileNameFormat: formData.fileNameFormat,
      lineNumber: formData.lineNumber || undefined,
      contractorEgaisId: formData.contractorEgaisId || undefined,
      shipperEgaisId: formData.shipperEgaisId || undefined,
      shipperName: formData.shipperName || undefined,
      recipientEgaisId: formData.recipientEgaisId || undefined,
      recipientName: formData.recipientName || undefined,
      ssccExtension: formData.ssccExtension || undefined,
      gs1Code: formData.gs1Code || undefined,
      additionalInfo: formData.additionalInfo || undefined,
    };

    try {
      let res;

      // ✅ РЕЖИМ РЕДАКТИРОВАНИЯ

      if (mode === 'edit' && id) {
        // await updateMutation.mutateAsync({ id, data });
        res = await fetch(`${API_URL}/table/agent-update/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      } else {
        // await createMutation.mutateAsync(data);

        res = await fetch(`${API_URL}/table/agent-create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }
      onCancel(); // Возвращаемся к списку после сохранения
    } catch (error) {
      console.error('Error saving counterparty:', error);
    }
  };

  const exportFormatOptions = [
    { value: 'Основной', label: 'Основной' },
    { value: 'Расширенный', label: 'Расширенный' },
    { value: 'Минимальный', label: 'Минимальный' },
    { value: 'Полный', label: 'Полный' },
  ];

  const barcodeTypeOptions = [
    { value: 'Альтернативный', label: 'Альтернативный' },
    { value: 'Основной', label: 'Основной' },
    { value: 'SSCC', label: 'SSCC' },
  ];

  const fileNameFormatOptions = [
    { value: 'По умолчанию', label: 'По умолчанию' },
    { value: 'Номер TTH', label: 'Номер TTH' },
    { value: 'Номер заявки', label: 'Номер заявки' },
  ];

  // if (mode === 'edit' && counterparty) {
  //   return <div className="p-6">Загрузка...</div>;
  // }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Основная информация контрагента
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Форма - точно такая же как у вас */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* <div className="space-y-2">
              <Label htmlFor="code" className="flex items-center gap-2">
                <HashIcon className="h-4 w-4" />
                Код
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Введите код"
                className="w-full"
              />
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Название
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Введите название"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exportFormat" className="flex items-center gap-2">
                <FileInput className="h-4 w-4" />
                Тип формата выгрузки
              </Label>
              <Select
                value={formData.exportFormat}
                onValueChange={(value) => handleSelectChange('exportFormat', value)}
              >
                <SelectTrigger id="exportFormat" className="w-full">
                  <SelectValue placeholder="Выберите формат" />
                </SelectTrigger>
                <SelectContent>
                  {exportFormatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contractorEgaisId" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Ид. контрагента в ЕГАИС
              </Label>
              <Input
                id="contractorEgaisId"
                value={formData.contractorEgaisId}
                onChange={handleChange}
                placeholder="Введите ID контрагента в ЕГАИС"
                className="w-full font-mono"
              />
            </div>
          </div>

          {/* Вторая строка: Тип штрихкода палеты, Тип формирования имени файла */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="barcodeType" className="flex items-center gap-2">
                <Barcode className="h-4 w-4" /> Тип штрихкода палеты
              </Label>
              <Select
                value={formData.barcodeType}
                onValueChange={(value) => handleSelectChange('barcodeType', value)}
              >
                <SelectTrigger id="barcodeType" className="w-full">
                  <SelectValue placeholder="Выберите тип штрихкода" />
                </SelectTrigger>
                <SelectContent>
                  {barcodeTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileNameFormat" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Тип формирования имени файла
              </Label>
              <Select
                value={formData.fileNameFormat}
                onValueChange={(value) => handleSelectChange('fileNameFormat', value)}
              >
                <SelectTrigger id="fileNameFormat" className="w-full">
                  <SelectValue placeholder="Выберите формат имени" />
                </SelectTrigger>
                <SelectContent>
                  {fileNameFormatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="displayName" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Название для отображения
              </Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Введите название для отображения"
                className="w-full"
              />
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="lineNumber" className="flex items-center gap-2">
                <HashIcon className="h-4 w-4" />№ линии
              </Label>
              <Input
                id="lineNumber"
                value={formData.lineNumber}
                onChange={handleChange}
                placeholder="Введите номер линии"
                className="w-full"
              />
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="min-w-24"
              // disabled={createMutation.isPending || updateMutation.isPending}
            >
              <X className="mr-2 h-4 w-4" />
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              className="min-w-24"
              // disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {/* {createMutation.isPending || updateMutation.isPending ? 'Сохранение...' : 'Сохранить'} */}
              {'Сохранить'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CounterpartiesForm;

{
  /* Разделитель */
}
//  <div className="border-t pt-6">
//  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//    <div className="space-y-2">
//      <Label htmlFor="lineNumber" className="flex items-center gap-2">
//        <HashIcon className="h-4 w-4" />№ линии
//      </Label>
//      <Input
//        id="lineNumber"
//        value={formData.lineNumber}
//        onChange={handleChange}
//        placeholder="Введите номер линии"
//        className="w-full"
//      />
//    </div>

//    <div className="space-y-2">
//      <Label htmlFor="contractorEgaisId" className="flex items-center gap-2">
//        <User className="h-4 w-4" />
//        Ид. контрагента в ЕГАИС
//      </Label>
//      <Input
//        id="contractorEgaisId"
//        value={formData.contractorEgaisId}
//        onChange={handleChange}
//        placeholder="Введите ID контрагента в ЕГАИС"
//        className="w-full font-mono"
//      />
//    </div>
//  </div>

//  Четвертая строка: Ид. грузоотправителя в ЕГАИС, Название грузоотправителя */}
//  {/* <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
//    <div className="space-y-2">
//      <Label htmlFor="shipperEgaisId" className="flex items-center gap-2">
//        <Truck className="h-4 w-4" />
//        Ид. грузоотправителя в ЕГАИС
//      </Label>
//      <Input
//        id="shipperEgaisId"
//        value={formData.shipperEgaisId}
//        onChange={handleChange}
//        placeholder="Введите ID грузоотправителя в ЕГАИС"
//        className="w-full font-mono"
//      />
//    </div>

//    <div className="space-y-2">
//      <Label htmlFor="shipperName" className="flex items-center gap-2">
//        <FileText className="h-4 w-4" />
//        Название грузоотправителя
//      </Label>
//      <Input
//        id="shipperName"
//        value={formData.shipperName}
//        onChange={handleChange}
//        placeholder="Введите название грузоотправителя"
//        className="w-full"
//      />
//    </div>
//  </div> */}

//  {/* Пятая строка: Ид. грузополучателя в ЕГАИС, Название грузополучателя */}
//  {/* <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
//    <div className="space-y-2">
//      <Label htmlFor="recipientEgaisId" className="flex items-center gap-2">
//        <Package className="h-4 w-4" />
//        Ид. грузополучателя в ЕГАИС
//      </Label>
//      <Input
//        id="recipientEgaisId"
//        value={formData.recipientEgaisId}
//        onChange={handleChange}
//        placeholder="Введите ID грузополучателя в ЕГАИС"
//        className="w-full font-mono"
//      />
//    </div>

//    <div className="space-y-2">
//      <Label htmlFor="recipientName" className="flex items-center gap-2">
//        <FileText className="h-4 w-4" />
//        Название грузополучателя
//      </Label>
//      <Input
//        id="recipientName"
//        value={formData.recipientName}
//        onChange={handleChange}
//        placeholder="Введите название грузополучателя"
//        className="w-full"
//      />
//    </div>
//  </div> */}

//  {/* Шестая строка: Цифра расширения SSCC, Международный регистрационный номер предприятия в системе GS1 */}
//  {/* <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
//    <div className="space-y-2">
//      <Label htmlFor="ssccExtension" className="flex items-center gap-2">
//        <HashIcon className="h-4 w-4" />
//        Цифра расширения SSCC
//      </Label>
//      <Input
//        id="ssccExtension"
//        value={formData.ssccExtension}
//        onChange={handleChange}
//        placeholder="Введите цифру расширения SSCC"
//        className="w-full"
//      />
//    </div>

//    <div className="space-y-2">
//      <Label htmlFor="gs1Code" className="flex items-center gap-2">
//        <Globe className="h-4 w-4" />
//        Международный регистрационный номер предприятия в системе GS1
//      </Label>
//      <Input
//        id="gs1Code"
//        value={formData.gs1Code}
//        onChange={handleChange}
//        placeholder="Введите номер GS1"
//        className="w-full font-mono"
//      />
//    </div>
//  </div>
// </div>
// */}
// {/* Седьмая строка: Дополнительная информация */}
// {/* <div className="space-y-2">
//  <Label htmlFor="additionalInfo" className="flex items-center gap-2">
//    <Info className="h-4 w-4" />
//    Дополнительная информация
//  </Label>
//  <Textarea
//    id="additionalInfo"
//    value={formData.additionalInfo}
//    onChange={handleChange}
//    placeholder="Введите дополнительную информацию..."
//    className="min-h-[120px] w-full"
//  />
// </div>
