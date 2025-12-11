// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router';
// import { Save, X, Edit, Barcode, Calendar, Hash, Droplets, Package, Building } from 'lucide-react';
// import {
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   Input,
//   Label,
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
//   Textarea,
// } from '../ui';
// import { DatePickerField } from '../shared/date-picker-field';
// import { useCounterparties } from '@/hooks/use-counterparties';
// import {
//   useCreateNomenclature,
//   useNomenclatureItem,
//   useUpdateNomenclature,
// } from '@/hooks/use-nomenclature';

// interface NomenclatureFormProps {
//   mode?: 'create' | 'edit';
// }

// const Nomenclature: React.FC<NomenclatureFormProps> = ({ mode = 'create' }) => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const { data: nomenclatureItem, isLoading: isLoadingNomenclature } = useNomenclatureItem(
//     id || '',
//   );

//   const { data: counterpartiesData } = useCounterparties();
//   const createMutation = useCreateNomenclature();
//   const updateMutation = useUpdateNomenclature();

//   const [formData, setFormData] = useState({
//     code: '',
//     name: '',
//     displayName: '',
//     productBarcode: '',
//     volume: '0.5',
//     egaisCode: '',
//     externalCode: '',
//     expirationDate: '',
//     strength: '',
//     contractorId: '',
//     additionalInfo: '',
//   });

//   // Данные по умолчанию (для примера)
//   const defaultData = {
//     barcode: '4810126008653',
//     volume: '1',
//     egaisCode: '030000712783000085',
//     productCode: '13',
//     name: 'Водка особая "Золотой урожай. Хлеб"',
//     displayName: 'Водка особая "Золотой урожай. Хлеб"',
//     productBarcode: '4810126008387',
//     productVolume: '0.5',
//     productEgaisCode: '000000000036466599',
//     externalCode: 'Не ограничен',
//     expiration: '40',
//     strength: '40',
//     contractor: 'ООО "Винный стиль"',
//   };

//   useEffect(() => {
//     if (mode === 'edit' && nomenclatureItem) {
//       setFormData({
//         code: nomenclatureItem.code || '',
//         name: nomenclatureItem.name || '',
//         displayName: nomenclatureItem.displayName || '',
//         productBarcode: nomenclatureItem.productBarcode || '',
//         volume: nomenclatureItem.volume?.toString() || '0.5',
//         egaisCode: nomenclatureItem.egaisCode || '',
//         externalCode: nomenclatureItem.externalCode || '',
//         expirationDate: nomenclatureItem.expirationDate
//           ? new Date(nomenclatureItem.expirationDate).toISOString().split('T')[0]
//           : '',
//         strength: nomenclatureItem.strength?.toString() || '',
//         contractorId: nomenclatureItem.contractorId || '',
//         additionalInfo: nomenclatureItem.additionalInfo || '',
//       });
//     }
//   }, [nomenclatureItem, mode]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleSelectChange = (id: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleDateChange = (date: Date | undefined) => {
//     setFormData((prev) => ({
//       ...prev,
//       expirationDate: date ? date.toISOString().split('T')[0] : '',
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const data = {
//       code: formData.code || defaultData.productCode,
//       name: formData.name || defaultData.name,
//       displayName: formData.displayName || defaultData.displayName,
//       productBarcode: formData.productBarcode || defaultData.productBarcode,
//       volume: parseFloat(formData.volume || defaultData.productVolume),
//       egaisCode: formData.egaisCode || defaultData.productEgaisCode,
//       externalCode: formData.externalCode || defaultData.externalCode,
//       expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : undefined,
//       strength: parseFloat(formData.strength || defaultData.strength),
//       contractorId: formData.contractorId || '',
//       additionalInfo: formData.additionalInfo || '',
//     };

//     try {
//       if (mode === 'edit' && id) {
//         await updateMutation.mutateAsync({ id, data });
//       } else {
//         await createMutation.mutateAsync(data);
//       }
//       navigate('/nomenclature');
//     } catch (error) {
//       console.error('Error saving nomenclature:', error);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/nomenclature');
//   };

//   const volumeOptions = [
//     { value: '0.2', label: '0.2 л' },
//     { value: '0.5', label: '0.5 л' },
//     { value: '1', label: '1 л' },
//     { value: '2', label: '2 л' },
//   ];

//   const contractorOptions =
//     counterpartiesData?.map((contractor) => ({
//       value: contractor.id,
//       label: contractor.name,
//     })) || [];

//   if (mode === 'edit' && isLoadingNomenclature) {
//     return <div className="p-6">Загрузка...</div>;
//   }

//   return (
//     <div className="container mx-auto space-y-6 p-6">
//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
//         <Card>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="code">Код</Label>
//                 <Input
//                   id="code"
//                   value={formData.code || defaultData.productCode}
//                   onChange={handleChange}
//                   placeholder="Введите код"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="strength" className="flex items-center gap-2">
//                   Крепость
//                 </Label>
//                 <Input
//                   id="strength"
//                   value={formData.strength || defaultData.strength}
//                   onChange={handleChange}
//                   placeholder="Введите крепость"
//                   type="number"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Название</Label>
//                 <Input
//                   id="name"
//                   value={formData.name || defaultData.name}
//                   onChange={handleChange}
//                   placeholder="Введите название"
//                   className="text-lg"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="displayName">Название для отображения</Label>
//                 <Input
//                   id="displayName"
//                   value={formData.displayName || defaultData.displayName}
//                   onChange={handleChange}
//                   placeholder="Введите название для отображения"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="productBarcode">Штрихкод продукции</Label>
//                 <Input
//                   id="productBarcode"
//                   value={formData.productBarcode || defaultData.productBarcode}
//                   onChange={handleChange}
//                   placeholder="Введите штрихкод"
//                   className="font-mono"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="expiration" className="flex items-center gap-2">
//                   Срок годности
//                 </Label>
//                 <DatePickerField
//                   value={formData.expirationDate ? new Date(formData.expirationDate) : undefined}
//                   onChange={handleDateChange}
//                   label=""
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="egaisCode">Код в ЕГАИС</Label>
//                 <Input
//                   id="egaisCode"
//                   value={formData.egaisCode || defaultData.productEgaisCode}
//                   onChange={handleChange}
//                   placeholder="Введите код ЕГАИС"
//                   className="font-mono"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="externalCode">Внешний код</Label>
//                 <Input
//                   id="externalCode"
//                   value={formData.externalCode || defaultData.externalCode}
//                   onChange={handleChange}
//                   placeholder="Введите внешний код"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="contractor" className="flex items-center gap-2">
//                   Контрагент
//                 </Label>
//                 <Select
//                   value={formData.contractorId}
//                   onValueChange={(value) => handleSelectChange('contractorId', value)}
//                 >
//                   <SelectTrigger id="contractor" className="min-w-[300px]">
//                     <SelectValue placeholder="Выберите контрагента" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {contractorOptions.map((option) => (
//                       <SelectItem key={option.value} value={option.value}>
//                         {option.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="volume">Объём тары</Label>
//                 <Select
//                   value={formData.volume}
//                   onValueChange={(value) => handleSelectChange('volume', value)}
//                 >
//                   <SelectTrigger id="volume" className="min-w-[200px]">
//                     <SelectValue placeholder="Выберите объём" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {volumeOptions.map((option) => (
//                       <SelectItem key={option.value} value={option.value}>
//                         {option.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="additionalInfo">Дополнительная информация</Label>
//               <Textarea
//                 id="additionalInfo"
//                 value={formData.additionalInfo}
//                 onChange={handleChange}
//                 placeholder="Введите дополнительную информацию..."
//                 className="min-h-[100px]"
//               />
//             </div>

//             <div className="flex justify-end gap-2 pt-4">
//               <Button
//                 variant="outline"
//                 onClick={handleCancel}
//                 disabled={createMutation.isPending || updateMutation.isPending}
//               >
//                 <X className="mr-2 h-4 w-4" />
//                 Отмена
//               </Button>
//               <Button
//                 onClick={handleSubmit}
//                 disabled={createMutation.isPending || updateMutation.isPending}
//               >
//                 <Save className="mr-2 h-4 w-4" />
//                 {createMutation.isPending || updateMutation.isPending
//                   ? 'Сохранение...'
//                   : 'Сохранить'}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Nomenclature;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Package, Plus, X } from 'lucide-react';
import NomenclatureList from '@/components/shared/table/nomenclature/nomenclature-list';
import NomenclatureForm from '@/components/shared/table/nomenclature/nomenclature-form';

const Nomenclature: React.FC = () => {
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreate = () => {
    setMode('create');
    setEditingId(null);
  };

  const handleEdit = (id: string) => {
    setMode('edit');
    setEditingId(id);
  };

  const handleBackToList = () => {
    setMode('list');
    setEditingId(null);
  };

  return (
    <div className="container mx-auto p-6">
      {mode === 'list' ? (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div>
              {/* <h1 className="flex items-center gap-3 text-3xl font-bold">
                <Package className="h-8 w-8" />
                Номенклатура
              </h1> */}
              <p className="mt-2 text-xl font-semibold">Управление справочником номенклатуры</p>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Новая номенклатура
            </Button>
          </div>
          <NomenclatureList onEdit={handleEdit} />
        </>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div>
              {/* <h1 className="flex items-center gap-3 text-3xl font-bold">
                <Package className="h-8 w-8" />
                {mode === 'create' ? 'Создание номенклатуры' : 'Редактирование номенклатуры'}
              </h1> */}
              <p className="mt-2 text-xl font-semibold">
                {mode === 'create'
                  ? 'Заполните информацию о новой номенклатуре'
                  : 'Измените информацию о номенклатуре'}
              </p>
            </div>
            <Button variant="outline" onClick={handleBackToList}>
              <X className="mr-2 h-4 w-4" />
              Назад к списку
            </Button>
          </div>
          <NomenclatureForm
            mode={mode === 'create' ? 'create' : 'edit'}
            id={editingId || undefined}
            onCancel={handleBackToList}
          />
        </>
      )}
    </div>
  );
};

export default Nomenclature;
