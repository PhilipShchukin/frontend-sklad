// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Loader2 } from 'lucide-react';
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
//   Button,
//   Input,
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   Textarea,
// } from '@/components/ui/index';
// import { useGetAgents, useGetReportCodes, useGetReportsForAgent } from '@/hooks/use-shipment';
// import { FormBlock } from '../shared/form-block';
// import { DatePickerField } from '../shared/date-picker-field';
// import { shipmentSchema, type ShipmentFormValues } from '@/types/pages-types/shipment.schema';

// // Тип для выбранных отчетов
// interface SelectedReport {
//   selected: boolean;
//   quantity: number | '';
//   // codes?: ReportCodes | null;
// }

// export default function Shipment() {
//   const [selectedAgent, setSelectedAgent] = useState<string>('');
//   const [selectedReports, setSelectedReports] = useState<Record<string, SelectedReport>>({});

//   const { data: agentsData, isLoading: isAgentsLoading } = useGetAgents();
//   const agents = agentsData ?? [];

//   const { data: reports, isLoading: isReportsLoading } = useGetReportsForAgent(selectedAgent);

//   const { mutate } = useGetReportCodes();

//   // Инициализация react-hook-form
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     watch,
//   } = useForm<ShipmentFormValues>({
//     resolver: zodResolver(shipmentSchema),
//     defaultValues: {
//       creator: 'admin',
//       yearDate: new Date(),
//     },
//   });

//   // Для отслеживания значений дат
//   const shipDate = watch('shipDate');
//   const closeDate = watch('closeDate');
//   const invoiceDate = watch('invoiceDate');

//   const updateReport = (id: string, changes: Partial<SelectedReport>) => {
//     setSelectedReports((prev) => ({
//       ...prev,
//       [id]: { ...prev[id], ...changes },
//     }));
//   };

//   const addToCodes = async (reportId: string) => {
//     try {
//       mutate(reportId);
//     } finally {
//     }
//   };

//   // Обработчик отправки формы
//   const onSubmit = async (data: ShipmentFormValues) => {
//     // Фильтруем только выбранные отчеты
//     const selectedReportsData = Object.entries(selectedReports)
//       .filter(([_, report]) => report.selected && report.quantity !== '')
//       .map(([id, report]) => {
//         const reportData = reports?.find((r) => r.id === id);
//         return {
//           id,
//           quantity: report.quantity,
//           selectAll: report.selectAll,
//           reportData: reportData, // Добавляем полные данные отчета
//         };
//       });

//     const formData = {
//       ...data,
//       selectedReports: selectedReportsData,
//     };

//     console.log('Данные для отправки:', formData);
//     // Здесь будет логика отправки на терминал
//     await fetch('http://localhost:4000/api/device-sync/send', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(formData),
//     });

//     alert('Задание отправлено 🚀');

//     // const selectedReportsData = Object.entries(selectedReports)s
//     //   .filter(([_, report]) => report.selected && report.quantity !== '')
//     //   .map(([id, report]) => {
//     //     const reportData = reports?.find((r) => r.id === id);
//     //     return {
//     //       id,
//     //       quantity: report.quantity,
//     //       selectAll: report.selectAll,
//     //       reportData,
//     //     };
//     //   });

//     // const formData = {
//     //   ...data,
//     //   selectedReports: selectedReportsData,
//     // };

//     // const result = await exportToTerminal(formData);

//     // alert(result.message);
//   };

//   // Обработчик сохранения
//   const onSave = () => {
//     handleSubmit((data) => {
//       console.log('Данные для сохранения:', {
//         ...data,
//         selectedReports: selectedReports,
//       });
//       // Логика сохранения
//     })();
//   };

//   return (
//     <div className="mx-auto max-w-6xl space-y-6 p-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Создание отгрузки</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <form onSubmit={handleSubmit(onSubmit)}>
//             {/* Контрагент */}
//             <div className="w-full max-w-md">
//               <Select
//                 value={selectedAgent}
//                 onValueChange={(value) => {
//                   setSelectedAgent(value);
//                   setValue('agent', value);
//                 }}
//               >
//                 <SelectTrigger className="w-[280px]">
//                   <SelectValue placeholder="Выберите агента" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {isAgentsLoading && (
//                     <div className="flex justify-center p-2">
//                       <Loader2 className="animate-spin" size={18} />
//                     </div>
//                   )}

//                   {!isAgentsLoading && agents.length === 0 && (
//                     <div className="p-2 text-sm text-gray-500">Нет агентов</div>
//                   )}

//                   {agents.map((agent) => (
//                     <SelectItem key={agent} value={agent}>
//                       {agent}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {errors.agent && <p className="mt-1 text-sm text-red-600">{errors.agent.message}</p>}
//             </div>

//             {/* Поля формы */}
//             <div className="space-y-8">
//               <FormBlock>
//                 {/* Дата отгрузки */}
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium">Дата отгрузки</label>
//                   <DatePickerField
//                     value={shipDate}
//                     onChange={(date) => setValue('shipDate', date)}
//                     label={''}
//                   />
//                   {errors.shipDate && (
//                     <p className="text-sm text-red-600">{errors.shipDate.message}</p>
//                   )}
//                 </div>

//                 {/* Код */}
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium">Код</label>
//                   <Input
//                     type="number"
//                     placeholder="Авто"
//                     {...register('code', { valueAsNumber: true })}
//                   />
//                   {errors.code && <p className="text-sm text-red-600">{errors.code.message}</p>}
//                 </div>

//                 {/* Создатель */}
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium">Создатель</label>
//                   <Input readOnly {...register('creator')} />
//                   {errors.creator && (
//                     <p className="text-sm text-red-600">{errors.creator.message}</p>
//                   )}
//                 </div>

//                 {/* № заявки */}
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium">№ заявки</label>
//                   <Input
//                     type="number"
//                     placeholder="Введите номер"
//                     {...register('applicationNumber', { valueAsNumber: true })}
//                   />
//                   {errors.applicationNumber && (
//                     <p className="text-sm text-red-600">{errors.applicationNumber.message}</p>
//                   )}
//                 </div>

//                 {/* Дата закрытия */}
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium">Дата закрытия</label>
//                   <DatePickerField
//                     value={closeDate}
//                     onChange={(date) => setValue('closeDate', date)}
//                   />
//                   {errors.closeDate && (
//                     <p className="text-sm text-red-600">{errors.closeDate.message}</p>
//                   )}
//                 </div>

//                 {/* Дата товарной накладной */}
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium">Дата товарной накладной</label>
//                   <DatePickerField
//                     value={invoiceDate}
//                     onChange={(date) => setValue('invoiceDate', date)}
//                   />
//                   {errors.invoiceDate && (
//                     <p className="text-sm text-red-600">{errors.invoiceDate.message}</p>
//                   )}
//                 </div>

//                 {/* Год заявки */}
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium">Год заявки</label>
//                   <Input
//                     value={new Date().getFullYear()}
//                     {...register('yearDate', {
//                       value: new Date(), // устанавливаем значение для zod
//                     })}
//                   />
//                   {errors.yearDate && (
//                     <p className="text-sm text-red-600">{errors.yearDate.message}</p>
//                   )}
//                 </div>

//                 {/* Описание */}
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium">Описание</label>
//                   <Textarea
//                     rows={3}
//                     placeholder="Описание задачи"
//                     className="resize-none"
//                     {...register('description')}
//                   />
//                   {errors.description && (
//                     <p className="text-sm text-red-600">{errors.description.message}</p>
//                   )}
//                 </div>
//               </FormBlock>
//             </div>

//             {/* Фасовки */}
//             <div className="space-y-4">
//               {reports ? <label className="font-medium">Доступные фасовки</label> : ''}

//               {isReportsLoading && selectedAgent && (
//                 <div className="flex justify-center">
//                   <Loader2 className="animate-spin" size={24} />
//                 </div>
//               )}

//               {!isReportsLoading && selectedAgent && reports?.length === 0 && (
//                 <p className="text-sm text-gray-500">Нет фасовок для выбранного агента.</p>
//               )}

//               {reports && reports.length > 0 && (
//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                   {reports.map((item) => {
//                     const isSelected = selectedReports[item.id]?.selected || false;
//                     const quantity = selectedReports[item.id]?.quantity || '';
//                     const selectAll = selectedReports[item.id]?.selectAll || false;

//                     return (
//                       <Card
//                         key={item.id}
//                         className={`relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 shadow-sm transition ${isSelected ? 'border-primary bg-muted/50 shadow-md' : 'hover:shadow-md'}`}
//                         onClick={() =>
//                           updateReport(item.id, {
//                             selected: !isSelected,
//                             quantity: !isSelected ? '' : quantity,
//                             selectAll: false,
//                           })
//                         }
//                       >
//                         {/* Чекбокс — выбрать все */}
//                         <input
//                           type="checkbox"
//                           className="accent-primary absolute top-3 right-3 h-4 w-4 cursor-pointer"
//                           checked={selectAll}
//                           onChange={(e) => {
//                             e.stopPropagation();
//                             updateReport(item.id, {
//                               selected: true,
//                               selectAll: e.target.checked,
//                               quantity: e.target.checked ? item.codesCount : '',
//                             });
//                           }}
//                           onClick={(e) => e.stopPropagation()}
//                         />

//                         {/* Инфо */}
//                         <div className="space-y-1">
//                           <p className="font-semibold">{item.name}</p>
//                           <p className="text-muted-foreground text-xs">GTIN: {item.gtin}</p>
//                           <p className="text-muted-foreground text-xs">Партия: {item.batch}</p>
//                           <p className="text-muted-foreground text-xs">
//                             Дата розлива: {item.manufactureDate}
//                           </p>
//                         </div>

//                         {/* Бутылки + количество */}
//                         <div className="mt-3 flex items-center gap-2 text-sm">
//                           <span className="font-medium">Бутылок:</span> {item.codesCount} /
//                           {isSelected ? (
//                             <Input
//                               type="number"
//                               className="h-8 w-20"
//                               min={1}
//                               max={item.codesCount}
//                               value={quantity}
//                               disabled={selectAll}
//                               onChange={(e) =>
//                                 updateReport(item.id, {
//                                   quantity: e.target.value === '' ? '' : Number(e.target.value),
//                                 })
//                               }
//                               onClick={(e) => e.stopPropagation()}
//                             />
//                           ) : (
//                             <Input type="number" className="h-8 w-20" readOnly placeholder="—" />
//                           )}
//                         </div>
//                       </Card>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Кнопки */}
//             <div className="flex justify-end gap-3">
//               <Button type="button" variant="secondary" onClick={onSave}>
//                 Сохранить задание
//               </Button>
//               <Button type="submit">Отправить на терминал</Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

{
  /* --- Фасовки --- */
}
//  <div className="space-y-4">
//             {reports ? <label className="font-medium">Доступные фасовки </label> : ''}

//             {isReportsLoading && selectedAgent && (
//               <div className="flex justify-center">
//                 <Loader2 className="animate-spin" size={24} />
//               </div>
//             )}
//             {!isReportsLoading && selectedAgent && reports?.length === 0 && (
//               <p className="text-sm text-gray-500">Нет фасовок для выбранного агента.</p>
//             )}
//             {reports && reports.length > 0 && (
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 {reports.map((item) => (
//                   <Card
//                     key={item.id}
//                     className="flex flex-col justify-between rounded-xl border p-4 shadow-sm transition hover:shadow-md"
//                   >
//                     <div className="space-y-1">
//                       <p className="font-semibold">{item.name}</p>
//                       <p className="text-muted-foreground text-xs">GTIN: {item.gtin}</p>
//                       <p className="text-muted-foreground text-xs">Партия: {item.batch}</p>
//                       <p className="text-muted-foreground text-xs">
//                         Дата розлива: {item.manufactureDate}
//                       </p>
//                     </div>

//                     <p className="mt-2 text-sm">
//                       <span className="font-medium">Бутылок:</span> {item.codesCount}
//                     </p>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </div>

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
} from '@/components/ui/index';
import { useGetAgents, useGetReportCodes, useGetReportsForAgent } from '@/hooks/use-shipment';
import { FormBlock } from '../shared/form-block';
import { DatePickerField } from '../shared/date-picker-field';
import { shipmentSchema, type ShipmentFormValues } from '@/types/pages-types/shipment.schema';

// Типы для данных
interface CodeRow {
  code: string;
  boxLabel: string;
  palletLabel: string;
}

interface Box {
  boxLabel: string;
  count: number;
  isScanned: boolean;
}

interface Pallet {
  name: string;
  boxes: Box[];
}

interface CodesStructure {
  pallets: Pallet[];
}

interface SelectedReport {
  selected: boolean;
  quantity: number | '';
  selectAll?: boolean;
  codes?: CodesStructure | null;
  isLoading?: boolean;
}

export default function Shipment() {
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedReports, setSelectedReports] = useState<Record<string, SelectedReport>>({});

  const { data: agentsData, isLoading: isAgentsLoading } = useGetAgents();

  const agents = agentsData ?? [];

  const { data: reports, isLoading: isReportsLoading } = useGetReportsForAgent(selectedAgent);

  const { mutate, isPending: isCodesLoading } = useGetReportCodes();

  // Инициализация react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      creator: 'admin',
      yearDate: new Date(),
    },
  });

  // Для отслеживания значений дат
  const shipDate = watch('shipDate');
  const closeDate = watch('closeDate');
  const invoiceDate = watch('invoiceDate');

  const updateReport = (id: string, changes: Partial<SelectedReport>) => {
    setSelectedReports((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...changes },
    }));
  };

  // Функция для преобразования данных кодов в нужную структуру
  const transformCodesData = (codesData: CodeRow[]): CodesStructure => {
    // Группируем по паллетам
    const palletsMap = new Map<string, Map<string, number>>();

    codesData.forEach((item) => {
      if (!palletsMap.has(item.palletLabel)) {
        palletsMap.set(item.palletLabel, new Map());
      }

      const boxMap = palletsMap.get(item.palletLabel)!;
      const currentCount = boxMap.get(item.boxLabel) || 0;
      boxMap.set(item.boxLabel, currentCount + 1);
    });

    // Преобразуем в нужную структуру
    const pallets: Pallet[] = [];

    palletsMap.forEach((boxMap, palletName) => {
      const boxes: Box[] = [];

      boxMap.forEach((count, boxLabel) => {
        boxes.push({
          boxLabel,
          count,
          isScanned: false,
        });
      });

      pallets.push({
        name: palletName,
        boxes,
      });
    });

    return { pallets };
  };

  const addToCodes = (reportId: string) => {
    // Устанавливаем флаг загрузки
    updateReport(reportId, { isLoading: true });

    // Используем mutate с onSuccess callback
    mutate(reportId, {
      onSuccess: (codesData: CodeRow[]) => {
        console.log('Полученные коды для', reportId, ':', codesData);

        if (codesData && codesData.length > 0) {
          const transformedCodes = transformCodesData(codesData);
          console.log('Преобразованные коды:', transformedCodes);

          updateReport(reportId, {
            codes: transformedCodes,
            isLoading: false,
          });
        } else {
          console.log('Нет данных кодов для', reportId);
          updateReport(reportId, {
            codes: null,
            isLoading: false,
          });
        }
      },
      onError: (error) => {
        console.error('Ошибка при получении кодов для', reportId, ':', error);
        updateReport(reportId, {
          codes: null,
          isLoading: false,
        });
      },
    });
  };

  // Обработчик выбора фасовки
  const handleReportSelect = (item: any) => {
    const isCurrentlySelected = selectedReports[item.id]?.selected || false;

    if (!isCurrentlySelected) {
      // Если выбираем фасовку - загружаем коды
      addToCodes(item.id);
    }

    updateReport(item.id, {
      selected: !isCurrentlySelected,
      quantity: !isCurrentlySelected ? '' : selectedReports[item.id]?.quantity || '',
      selectAll: false,
    });
  };

  // Обработчик отправки формы
  const onSubmit = async (data: ShipmentFormValues) => {
    console.log('Все selectedReports:', selectedReports);

    // Фильтруем только выбранные отчеты и преобразуем в нужную структуру
    const selectedReportsData = Object.entries(selectedReports)
      .filter(([id, report]) => {
        console.log(`Проверка отчета ${id}:`, {
          selected: report.selected,
          quantity: report.quantity,
          hasCodes: !!report.codes,
          codes: report.codes,
        });
        return report.selected && report.quantity !== '' && report.codes;
      })
      .map(([id, report]) => {
        const reportData = reports?.find((r) => r.id === id);
        console.log(`Формируем данные для ${id}:`, reportData);

        return {
          id,
          quantity: Number(report.quantity),
          batch: reportData?.batch || '',
          name: reportData?.name || '',
          description: reportData?.description || '',
          status: 'IN_STOCK',
          codes: report.codes!,
        };
      });

    console.log('Отфильтрованные отчеты:', selectedReportsData);

    const formData = {
      ...data,
      docId: `doc-${Math.floor(Math.random() * 100)}`,
      selectedReports: selectedReportsData,
    };

    console.log('Данные для отправки:', JSON.stringify(formData, null, 2));

    // Отправка данных
    try {
      await fetch('http://localhost:4000/api/device-sync/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      alert('Задание отправлено 🚀');
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Ошибка при отправке задания');
    }
  };

  // Обработчик сохранения
  const onSave = () => {
    handleSubmit((data) => {
      const selectedReportsData = Object.entries(selectedReports)
        .filter(([_, report]) => report.selected && report.quantity !== '' && report.codes)
        .map(([id, report]) => {
          const reportData = reports?.find((r) => r.id === id);
          return {
            id,
            quantity: Number(report.quantity),
            batch: reportData?.batch || '',
            name: reportData?.name || '',
            description: reportData?.description || '',
            status: 'IN_STOCK',
            codes: report.codes!,
          };
        });

      console.log('Данные для сохранения:', {
        ...data,
        docId: `doc-${Math.floor(Math.random() * 100)}`,
        selectedReports: selectedReportsData,
      });
      // Логика сохранения
    })();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Создание отгрузки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Контрагент */}
            <div className="w-full max-w-md">
              <Select
                value={selectedAgent}
                onValueChange={(value) => {
                  setSelectedAgent(value);
                  setValue('agent', value);
                }}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Выберите агента" />
                </SelectTrigger>
                <SelectContent>
                  {isAgentsLoading && (
                    <div className="flex justify-center p-2">
                      <Loader2 className="animate-spin" size={18} />
                    </div>
                  )}

                  {!isAgentsLoading && agents.length === 0 && (
                    <div className="p-2 text-sm text-gray-500">Нет агентов</div>
                  )}

                  {agents.map((agent) => (
                    <SelectItem key={agent} value={agent}>
                      {agent}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.agent && <p className="mt-1 text-sm text-red-600">{errors.agent.message}</p>}
            </div>

            {/* Поля формы */}
            <div className="space-y-8">
              <FormBlock>
                {/* Дата отгрузки */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Дата отгрузки</label>
                  <DatePickerField
                    value={shipDate}
                    onChange={(date) => setValue('shipDate', date)}
                    label={''}
                  />
                  {errors.shipDate && (
                    <p className="text-sm text-red-600">{errors.shipDate.message}</p>
                  )}
                </div>

                {/* Код */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Код</label>
                  <Input
                    type="number"
                    placeholder="Авто"
                    {...register('code', { valueAsNumber: true })}
                  />
                  {errors.code && <p className="text-sm text-red-600">{errors.code.message}</p>}
                </div>

                {/* Создатель */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Создатель</label>
                  <Input readOnly {...register('creator')} />
                  {errors.creator && (
                    <p className="text-sm text-red-600">{errors.creator.message}</p>
                  )}
                </div>

                {/* № заявки */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">№ заявки</label>
                  <Input
                    type="number"
                    placeholder="Введите номер"
                    {...register('applicationNumber', { valueAsNumber: true })}
                  />
                  {errors.applicationNumber && (
                    <p className="text-sm text-red-600">{errors.applicationNumber.message}</p>
                  )}
                </div>

                {/* Дата закрытия */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Дата закрытия</label>
                  <DatePickerField
                    value={closeDate}
                    onChange={(date) => setValue('closeDate', date)}
                  />
                  {errors.closeDate && (
                    <p className="text-sm text-red-600">{errors.closeDate.message}</p>
                  )}
                </div>

                {/* Дата товарной накладной */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Дата товарной накладной</label>
                  <DatePickerField
                    value={invoiceDate}
                    onChange={(date) => setValue('invoiceDate', date)}
                  />
                  {errors.invoiceDate && (
                    <p className="text-sm text-red-600">{errors.invoiceDate.message}</p>
                  )}
                </div>

                {/* Год заявки */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Год заявки</label>
                  <Input
                    value={new Date().getFullYear()}
                    {...register('yearDate', {
                      value: new Date(),
                    })}
                  />
                  {errors.yearDate && (
                    <p className="text-sm text-red-600">{errors.yearDate.message}</p>
                  )}
                </div>

                {/* Описание */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Описание</label>
                  <Textarea
                    rows={3}
                    placeholder="Описание задачи"
                    className="resize-none"
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
              </FormBlock>
            </div>

            {/* Фасовки */}
            <div className="space-y-4">
              {reports ? <label className="font-medium">Доступные фасовки</label> : ''}

              {isReportsLoading && selectedAgent && (
                <div className="flex justify-center">
                  <Loader2 className="animate-spin" size={24} />
                </div>
              )}

              {!isReportsLoading && selectedAgent && reports?.length === 0 && (
                <p className="text-sm text-gray-500">Нет фасовок для выбранного агента.</p>
              )}

              {reports && reports.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {reports.map((item) => {
                    const reportState = selectedReports[item.id] || {};
                    const isSelected = reportState.selected || false;
                    const quantity = reportState.quantity || '';
                    const selectAll = reportState.selectAll || false;
                    const hasCodes = !!reportState.codes;
                    const isLoading = reportState.isLoading || false;

                    return (
                      <Card
                        key={item.id}
                        className={`relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 shadow-sm transition ${isSelected ? 'border-primary bg-muted/50 shadow-md' : 'hover:shadow-md'} ${isSelected && isLoading ? 'border-yellow-400 bg-yellow-50' : ''}`}
                        onClick={() => handleReportSelect(item)}
                      >
                        {/* Чекбокс — выбрать все */}
                        <input
                          type="checkbox"
                          className="accent-primary absolute top-3 right-3 h-4 w-4 cursor-pointer"
                          checked={selectAll}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateReport(item.id, {
                              selected: true,
                              selectAll: e.target.checked,
                              quantity: e.target.checked ? item.codesCount : '',
                            });
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />

                        {/* Индикатор загрузки кодов */}
                        {isLoading && (
                          <div className="absolute top-3 left-3">
                            <Loader2 className="animate-spin" size={16} />
                          </div>
                        )}

                        {/* Инфо */}
                        <div className="space-y-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-muted-foreground text-xs">GTIN: {item.gtin}</p>
                          <p className="text-muted-foreground text-xs">Партия: {item.batch}</p>
                          <p className="text-muted-foreground text-xs">
                            Дата розлива: {item.manufactureDate}
                          </p>
                          {hasCodes && <p className="text-xs text-green-600">Коды загружены ✓</p>}
                          {isSelected && !hasCodes && !isLoading && (
                            <p className="text-xs text-red-600">Ошибка загрузки кодов</p>
                          )}
                        </div>

                        {/* Бутылки + количество */}
                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <span className="font-medium">Бутылок:</span> {item.codesCount} /
                          {isSelected ? (
                            <Input
                              type="number"
                              className="h-8 w-20"
                              min={1}
                              max={item.codesCount}
                              value={quantity}
                              disabled={selectAll || isLoading}
                              onChange={(e) =>
                                updateReport(item.id, {
                                  quantity: e.target.value === '' ? '' : Number(e.target.value),
                                })
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <Input type="number" className="h-8 w-20" readOnly placeholder="—" />
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Кнопки */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={onSave}>
                Сохранить задание
              </Button>
              <Button type="submit">Отправить на терминал</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
