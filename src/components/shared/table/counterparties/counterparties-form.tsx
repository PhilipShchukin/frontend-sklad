import React, { useState, useEffect } from 'react';
import {
  Save,
  X,
  FileText,
  Barcode,
  Building,
  FileInput,
  Type,
  HashIcon,
  User,
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
} from '@/components/ui';
import { fetch } from '@tauri-apps/plugin-http';

interface CounterpartiesFormProps {
  mode: 'create' | 'edit';
  id?: string;
  onCancel: () => void;
}
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

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
  const [counterparty, setCounterparty] = useState<counterparty>();

  const fetchCounterparty = async () => {
    const res = await fetch(API_URL + `/table/agent-find-one/${id}`, {
      method: 'GET',
    });

    const data: counterparty = await res.json();
    setCounterparty(data);
  };

  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchCounterparty();
    }
  }, [mode, id]);

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

      if (mode === 'edit' && id) {
        res = await fetch(`${API_URL}/table/agent-update/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      } else {
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
