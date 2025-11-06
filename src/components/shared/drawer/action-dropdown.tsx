import * as React from 'react';
import { Package } from 'lucide-react';
import {
  useChangeStatusBox,
  useDeletePalleteForBox,
  useGetStatusBox,
  useMoveCode,
  usePalletsAll,
} from '@/hooks/use-report';

import { Command, CommandGroup, CommandList } from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Status } from '@/services/constants';

export function ActionDropDown({ boxNumber, reportId }: { boxNumber: number; reportId: string }) {
  const { mutate } = useMoveCode();
  const { mutate: changeStatus } = useChangeStatusBox();
  const { mutate: deletePallet } = useDeletePalleteForBox();
  const { data: pallets, isLoading, refetch } = usePalletsAll(boxNumber, reportId);
  const {
    data: getStatus,
    isLoading: isGetStatusLoading,
    refetch: getRefetch,
  } = useGetStatusBox(boxNumber, reportId);

  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div
          key={boxNumber}
          onClick={() => {
            refetch();
            getRefetch();
          }}
          className="bg-muted relative flex h-14 w-14 cursor-pointer items-center justify-center gap-0.5 rounded-lg border transition hover:bg-neutral-200 sm:h-16 sm:w-16"
        >
          <Package className="text-muted-foreground h-7 w-7 opacity-60 sm:h-8 sm:w-8" />

          <span className="text-foreground inset-0 flex items-center justify-center text-sm font-semibold sm:text-base">
            {boxNumber}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Действия с коробкой #{boxNumber}</DropdownMenuLabel>
        <DropdownMenuGroup>
          {/* <DropdownMenuItem>Просмотреть детали</DropdownMenuItem> */}
          {/* <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => deletePallet({ boxNumber, reportId })}
          >
            Удалить с палеты
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              Переместить на паллету
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {isLoading ? (
                      <DropdownMenuItem>Загрузка паллет...</DropdownMenuItem>
                    ) : pallets && pallets.length > 0 ? (
                      pallets.map((pallet: number) => (
                        <DropdownMenuItem
                          key={pallet}
                          onClick={() => mutate({ boxNumber, reportId, newPalletNumber: pallet })}
                        >
                          {pallet}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem disabled className="text-muted-foreground">
                        Нет доступных паллет
                      </DropdownMenuItem>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              Изменить статус
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {isGetStatusLoading ? (
                      <DropdownMenuItem>Загрузка статуса...</DropdownMenuItem>
                    ) : (
                      getStatus?.map((status: Status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => changeStatus({ boxNumber, reportId, status })}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-red-600"
            onClick={() => deletePallet({ boxNumber, reportId })}
          >
            Удалить с палеты
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
