import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { z } from 'zod';
import { useState, useCallback } from 'react';
import { Loader2, ChevronDown, X } from 'lucide-react';
import { useGetAgents, useGetReportsForAgent } from '@/hooks/use-shipment';
import type { AgentList, GetReportsForAgent } from '@/services/shipment.service';
import { AgentSelector } from '../shared/agent-list/agent-selector';

const shipSchema = z.object({
  group: z.string().optional(),
  shipping_doc: z.string().optional(),
  nomer_tn: z.string().optional(),
  country: z.string().optional(),
  agent: z.string().optional(),
  count: z.string().optional(),
  price: z.string().optional(),
  currency: z.string().optional(),
  comment: z.string().optional(),
  operation_date: z.date().optional(),
  eas_products: z
    .array(
      z.object({
        gtin: z.string(),
        product_cost: z.string().optional(),
        product_tax: z.string().optional(),
        product_currency: z.string().optional(),
      }),
    )
    .optional(),
});

type ShipFormValues = z.infer<typeof shipSchema>;

interface SelectedReport {
  selected: boolean;
  quantity: number | '';
  selectAll?: boolean;
  // codes?: CodesStructure | null;
  gtin?: string;
  isLoading?: boolean;
}

export default function ShipAdd() {
  const [selectedGtin, setSelectedGtin] = useState<string[]>([]);
  const [selectedReports, setSelectedReports] = useState<Record<string, SelectedReport>>({});
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { data: gtinsData, isLoading: isAgentsLoading } = useGetAgents();

  const gtins = gtinsData ?? [];

  const { data: reports, isLoading } = useGetReportsForAgent(selectedGtin);

  const [selectedListAgent, setSelectedListAgent] = useState<AgentList[]>([]);

  const handleAgenList = useCallback((agent: AgentList) => {
    setSelectedListAgent((prev) => {
      const exists = prev.some((a) => a.id === agent.id);
      if (exists) {
        return prev.filter((a) => a.id !== agent.id);
      } else {
        return [...prev, agent];
      }
    });
  }, []);

  const removeAgentList = useCallback((agentId: number) => {
    setSelectedListAgent((prev) => prev.filter((a) => a.id !== agentId));
  }, []);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ShipFormValues>({
    resolver: zodResolver(shipSchema),
    defaultValues: {
      eas_products: [],
      operation_date: new Date(),
    },
  });

  const {
    fields: gtinFields,
    append: appendGtin,
    remove: removeGtin,
  } = useFieldArray({
    control,
    name: 'eas_products',
  });

  const updateReport = (gtin: string, changes: Partial<SelectedReport>) => {
    setSelectedReports((prev) => ({
      ...prev,
      [gtin]: { ...prev[gtin], ...changes },
    }));
  };

  // Обработчик выбора/снятия агента
  const handleAgentToggle = (agent: string) => {
    setSelectedGtin((prev) => {
      if (prev.includes(agent)) {
        // Удаляем агент и очищаем связанные reports
        const newAgents = prev.filter((a) => a !== agent);

        // Очищаем selectedReports для этого агента
        const agentReports = reports?.filter((r) => r.gtin === agent);
        agentReports?.forEach((report) => {
          setSelectedReports((prevReports) => {
            const newReports = { ...prevReports };
            delete newReports[report.gtin];
            return newReports;
          });
        });

        return newAgents;
      } else {
        return [...prev, agent];
      }
    });
  };

  // Удаление отдельного агента
  const removeAgent = (agent: string) => {
    handleAgentToggle(agent);
  };

  // Обработчик выбора фасовки
  const handleReportSelect = (item: GetReportsForAgent) => {
    const isCurrentlySelected = selectedReports[item.gtin]?.selected || false;

    // if (!isCurrentlySelected) {
    //   addToCodes(item.gtin);
    // }

    updateReport(item.gtin, {
      selected: !isCurrentlySelected,
      quantity: !isCurrentlySelected ? '' : selectedReports[item.gtin]?.quantity || '',
      selectAll: false,
    });
  };

  const onSubmit = async (data: ShipFormValues) => {
    console.log('selectedReports', selectedReports);

    const selectedReportsData = Object.entries(selectedReports)
      .filter(([gtin, report]) => report.selected && report.quantity !== '')
      .map(([gtin, report]) => {
        const reportData = reports?.find((r) => r.gtin === gtin);

        return {
          gtin, // GTIN
          quantity: Number(report.quantity),
          name: reportData?.gtin ?? gtin,
          status: 'IN_STOCK',
          codes: [],
        };
      });

    const payload = {
      ...data,
      agents: selectedListAgent[0].id,
      eas_products: Object.fromEntries(
        (data.eas_products || []).map((p) => {
          const { gtin, ...rest } = p;
          return [gtin, rest];
        }),
      ),
      labels: selectedReportsData,
    };

    // console.log('payload', JSON.stringify(payload, null, 2));

    alert('Отгрузка успешно создана! Проверьте консоль для просмотра payload.');

    await fetch('http://localhost:4000/api/device-sync/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Создание отгрузки</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Мультиселект GTIN */}
            <div className="flex gap-21">
              <div className="w-full max-w-md space-y-2">
                <label className="text-sm font-medium">Выберите GTIN</label>

                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isPopoverOpen}
                      className="h-auto min-h-[40px] w-full justify-between"
                    >
                      <div className="flex flex-1 flex-wrap gap-1">
                        {selectedGtin.length === 0 ? (
                          <span className="text-muted-foreground">Выберите GTIN...</span>
                        ) : (
                          selectedGtin.map((gtin) => (
                            <Badge key={gtin} variant="secondary" className="mr-1 mb-1">
                              {gtin}
                              <button
                                type="button"
                                className="hover:text-destructive ml-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeAgent(gtin);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))
                        )}
                      </div>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full min-w-[280px] p-0" align="start">
                    <div className="max-h-[300px] overflow-auto">
                      {isAgentsLoading && (
                        <div className="flex justify-center p-4">
                          <Loader2 className="animate-spin" size={18} />
                        </div>
                      )}

                      {!isAgentsLoading && gtins.length === 0 && (
                        <div className="text-muted-foreground p-4 text-center text-sm">
                          Нет доступных GTIN
                        </div>
                      )}

                      {!isAgentsLoading &&
                        gtins.map((gtin) => (
                          <div
                            key={gtin}
                            className="hover:bg-muted flex cursor-pointer items-center space-x-2 border-b p-3 last:border-b-0"
                            onClick={() => handleAgentToggle(gtin)}
                          >
                            <Checkbox
                              checked={selectedGtin.includes(gtin)}
                              onCheckedChange={() => handleAgentToggle(gtin)}
                            />
                            <span className="text-sm">{gtin}</span>
                          </div>
                        ))}
                    </div>
                  </PopoverContent>
                </Popover>
                {/* Контрагент */}
                {selectedGtin.length > 0 && (
                  <p className="text-muted-foreground text-xs">
                    Выбрано: {selectedGtin.length} GTIN
                  </p>
                )}
              </div>

              <div className="w-full max-w-md space-y-2">
                <label className="text-sm font-medium">Выберите контрагента</label>

                <AgentSelector
                  selectedAgents={selectedListAgent}
                  onAgentToggle={handleAgenList}
                  onRemoveAgent={removeAgentList}
                  placeholder="Начните вводить имя контрагента..."
                />

                {/* Дополнительная информация о выбранных контрагентах */}
                {selectedListAgent.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {selectedListAgent.map((agentList) => (
                      <div key={agentList.id} className="rounded-lg border p-3 text-sm">
                        <div className="font-medium">{agentList.name}</div>
                        <div className="text-muted-foreground text-xs">
                          ID: {agentList.id} • УНП: {agentList.unp} • GLN: {agentList.gln}
                        </div>
                        {agentList.address && (
                          <div className="text-muted-foreground mt-1 truncate text-xs">
                            {agentList.address}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Основные параметры */}
            <div className="space-y-4">
              <h3 className="font-medium">Основные параметры</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Select onValueChange={(v) => setValue('group', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Товарная группа" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dietary_supplements">БАД</SelectItem>
                    <SelectItem value="medical_products">Медицинские изделия</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={(v) => setValue('shipping_doc', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Вид документа" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tnttn">ТНТТН</SelectItem>
                  </SelectContent>
                </Select>

                <Input placeholder="Номер документа" {...register('nomer_tn')} />
                <Input placeholder="Код страны" {...register('country')} />
                <Input placeholder="Количество" {...register('count')} />
                <Input placeholder="Стоимость" {...register('price')} />
                <Input placeholder="Валюта" {...register('currency')} />
              </div>

              <Textarea placeholder="Комментарий" {...register('comment')} />
            </div>

            {/* Товары (GTIN) */}
            <div className="space-y-4">
              <h3 className="font-medium">Товары (GTIN)</h3>
              {gtinFields.map((field, index) => (
                <Card key={field.id} className="space-y-3 p-4">
                  <Input placeholder="GTIN" {...register(`eas_products.${index}.gtin`)} />

                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder="Цена" {...register(`eas_products.${index}.product_cost`)} />
                    <Input placeholder="НДС" {...register(`eas_products.${index}.product_tax`)} />
                    <Input
                      placeholder="Валюта"
                      {...register(`eas_products.${index}.product_currency`)}
                    />
                  </div>

                  <Button type="button" variant="destructive" onClick={() => removeGtin(index)}>
                    Удалить GTIN
                  </Button>
                </Card>
              ))}

              <Button type="button" variant="outline" onClick={() => appendGtin({ gtin: '' })}>
                + Добавить GTIN
              </Button>
            </div>

            {/* Фасовки */}
            {!reports ? (
              <>Loadig ....</>
            ) : (
              <div className="space-y-4">
                {reports.length > 0 && <label className="font-medium">Доступные фасовки</label>}

                {isLoading && selectedGtin.length > 0 && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin" size={24} />
                  </div>
                )}

                {!isLoading && selectedGtin.length > 0 && reports.length === 0 && (
                  <p className="text-muted-foreground text-sm">Нет фасовок для выбранных GTIN.</p>
                )}

                {reports.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {reports.map((item) => {
                      const reportState: SelectedReport = selectedReports[item.gtin] || {
                        selected: false,
                        quantity: '',
                        selectAll: false,
                        gtin: null,
                        isLoading: false,
                      };
                      const isSelected = reportState.selected || false;
                      const quantity = reportState.quantity || '';
                      const selectAll = reportState.selectAll || false;
                      // const hasCodes = !!reportState.gtin;
                      const isLoading = reportState.isLoading || false;

                      return (
                        <Card
                          key={item.gtin}
                          className={`relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 shadow-sm transition ${
                            isSelected ? 'border-primary bg-muted/50 shadow-md' : 'hover:shadow-md'
                          } ${isSelected && isLoading ? 'border-yellow-500 bg-yellow-50' : ''}`}
                          onClick={() => handleReportSelect(item)}
                        >
                          {/* Чекбокс — выбрать все */}
                          <input
                            type="checkbox"
                            className="accent-primary absolute top-3 right-3 h-4 w-4 cursor-pointer"
                            checked={selectAll}
                            onChange={(e) => {
                              e.stopPropagation();
                              updateReport(item.gtin, {
                                selected: true,
                                selectAll: e.target.checked,
                                quantity: e.target.checked ? item.count : '',
                              });
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />

                          {/* Инфо */}
                          <div className="space-y-1">
                            <p className="font-semibold">{item.gtin}</p>
                            <p className="text-muted-foreground text-xs">GTIN: {item.gtin}</p>
                          </div>

                          {/* Бутылки + количество */}
                          <div className="mt-3 flex items-center gap-2 text-sm">
                            <span className="font-medium">Количество:</span> {item.count} /
                            {isSelected ? (
                              <Input
                                type="number"
                                className="h-8 w-20"
                                min={1}
                                max={item.count}
                                value={quantity}
                                disabled={selectAll || isLoading}
                                onChange={(e) =>
                                  updateReport(item.gtin, {
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
            )}

            <div className="flex justify-end">
              <Button type="submit">Создать отгрузку</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
