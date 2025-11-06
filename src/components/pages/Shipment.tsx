import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Search } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useGetAgents, useGetShipment, useShipmentByGtin } from '@/hooks/use-shipment';

export default function Shipment() {
  const [counterparty, setCounterparty] = useState<string>('');
  const [openCounterparty, setOpenCounterparty] = useState(false);

  const [date, setDate] = useState<Date | undefined>();
  const [openDate, setOpenDate] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState<
    { name: string; gtin: string; qty: number }[]
  >([]);
  const [stockCounts, setStockCounts] = useState<Record<string, number>>({});
  const [note, setNote] = useState('');

  const { data: shipment, isLoading } = useGetShipment();
  const { mutateAsync } = useShipmentByGtin();

  const { data: shipmentAgents } = useGetAgents();
  // const counterparties = shipmentAgents?.agents_list.map((items)=> {
  //   {items.name}
  // });
  const counterparties = shipmentAgents?.agents_list;
  // console.log(shipmentAgents?.agents_list, 'shipmentAgents');
  console.log(selectedProducts, 'selectedProducts');
  console.log(counterparty, 'counterparty');
  console.log(date, 'date');

  const toggleProduct = async (product: { name: string; gtin: string }) => {
    const exists = selectedProducts.some((p) => p.gtin === product.gtin);

    if (exists) {
      setSelectedProducts((prev) => prev.filter((p) => p.gtin !== product.gtin));
      setStockCounts((prev) => {
        const copy = { ...prev };
        delete copy[product.gtin];
        return copy;
      });
    } else {
      setSelectedProducts((prev) => [...prev, { ...product, qty: 1 }]);

      try {
        const result = await mutateAsync(product.gtin); // ✅ await добавлен
        setStockCounts((prev) => ({
          ...prev,
          [product.gtin]: Number(result.count),
        }));
      } catch (err) {
        console.error('Ошибка получения количества:', err);
      }
    }
  };

  const updateQty = (gtin: string, qty: number) => {
    setSelectedProducts((prev) => prev.map((p) => (p.gtin === gtin ? { ...p, qty } : p)));
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Создание отгрузки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Контрагент */}
          <div className="space-y-2">
            <label className="font-medium">Контрагент</label>

            <Popover open={openCounterparty} onOpenChange={setOpenCounterparty}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="mt-1 w-full justify-between">
                  {counterparty || 'Выберите контрагента'}
                  <Search className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[400px] max-w-[90vw] p-0" // Адаптивная ширина
                align="start"
              >
                <Command>
                  <div className="sticky top-0 z-10 border-b bg-white">
                    <CommandInput placeholder="Поиск контрагента..." className="h-10" />
                  </div>
                  <CommandEmpty className="text-muted-foreground py-6 text-center text-sm">
                    Ничего не найдено.
                  </CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {counterparties?.map((c) => (
                      <CommandItem
                        key={c.id}
                        value={c.name}
                        onSelect={() => {
                          setCounterparty(c.name);
                          setOpenCounterparty(false);
                        }}
                        className="cursor-pointer px-3 py-2"
                      >
                        <div className="flex w-full min-w-0 flex-col">
                          {' '}
                          {/* Добавлено min-w-0 */}
                          <span className="font-medium break-words whitespace-normal">
                            {' '}
                            {/* Изменено */}
                            {c.name}
                          </span>
                          {c.unp && (
                            <span className="text-muted-foreground mt-1 text-xs">УНП: {c.unp}</span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Дата */}
          <div className="space-y-2">
            <label className="font-medium">Дата отгрузки</label>
            <Popover open={openDate} onOpenChange={setOpenDate}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'mt-1 w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? date.toLocaleDateString() : 'Выберите дату'}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setOpenDate(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Продукты */}
          {/* <div className="space-y-2">
            <label className="font-medium">Продукты</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="mt-1 w-full justify-between">
                  {selectedProducts.length > 0
                    ? `${selectedProducts.length} выбрано`
                    : 'Выберите продукты'}
                  <Search className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-0">
                <Command>
                  <CommandInput placeholder="Поиск продуктов..." />
                  <CommandEmpty>Нет совпадений.</CommandEmpty>
                  <CommandGroup>
                    {shipment?.map((item) => (
                      <CommandItem
                        key={item.gtin}
                        onSelect={() => toggleProduct({ name: item.name, gtin: item.gtin })}
                      >
                        <input
                          type="checkbox"
                          checked={selectedProducts.some((sp) => sp.gtin === item.gtin)}
                          readOnly
                          className="mr-2"
                        />
                        {item.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="space-y-2">
              {selectedProducts.map((p) => (
                <div
                  key={p.gtin}
                  className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="truncate font-medium">{p.name}</span>
                    {stockCounts[p.gtin] !== undefined ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        {stockCounts[p.gtin]} шт.
                      </span>
                    ) : (
                      <span className="inline-flex animate-pulse items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                        Загрузка...
                      </span>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    <Input
                      type="number"
                      min={1}
                      value={p.qty}
                      onChange={(e) => updateQty(p.gtin, Number(e.target.value))}
                      className="w-24"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div> */}
          <div className="space-y-2">
            <label className="font-medium">Продукты</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="mt-1 w-full justify-between">
                  {selectedProducts.length > 0
                    ? `${selectedProducts.length} выбрано`
                    : 'Выберите продукты'}
                  <Search className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] max-w-[90vw] p-0" align="start">
                <Command>
                  <div className="sticky top-0 z-10 border-b bg-white">
                    <CommandInput placeholder="Поиск продуктов..." className="h-10" />
                  </div>
                  <CommandEmpty className="text-muted-foreground py-6 text-center text-sm">
                    Нет совпадений.
                  </CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {shipment?.map((item) => (
                      <CommandItem
                        key={item.gtin}
                        onSelect={() => toggleProduct({ name: item.name, gtin: item.gtin })}
                        className="cursor-pointer px-3 py-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedProducts.some((sp) => sp.gtin === item.gtin)}
                          readOnly
                          className="mt-0.5 mr-3 h-4 w-4 flex-shrink-0"
                        />
                        <span className="line-clamp-2 break-words whitespace-normal">
                          {' '}
                          {/* Изменено */}
                          {item.name}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Кол-ва */}
            <div className="space-y-2">
              {selectedProducts.map((p) => (
                <div
                  key={p.gtin}
                  className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2"
                >
                  {/* Левая часть — название + запас */}
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="line-clamp-2 pl-1 font-medium break-words whitespace-normal">
                      {' '}
                      {/* Изменено */}
                      {p.name}
                    </span>
                    {stockCounts[p.gtin] !== undefined ? (
                      <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        {stockCounts[p.gtin]} шт.
                      </span>
                    ) : (
                      <span className="inline-flex flex-shrink-0 animate-pulse items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                        Загрузка...
                      </span>
                    )}
                  </div>

                  {/* Правая часть — ввод количества */}
                  <div className="flex-shrink-0">
                    <Input
                      type="number"
                      min={1}
                      value={p.qty}
                      onChange={(e) => updateQty(p.gtin, Number(e.target.value))}
                      className="w-24"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Примечания */}
          {/* <div className="space-y-2">
            <label className="font-medium">Примечания</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Напишите что-то..."
              className="mt-1"
            />
          </div> */}

          {/* Кнопки */}
          <div className="flex justify-end gap-3">
            <Button variant="secondary">Сохранить задание</Button>
            <Button>Отправить на терминал</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
