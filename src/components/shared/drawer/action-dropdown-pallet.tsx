import * as React from 'react';
import { Package } from 'lucide-react';
import { Command, CommandGroup, CommandList } from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Status } from '@/services/constants';
import { useDeletePallet, useChangeStatusPallet, useUnpackPallet } from '@/hooks/use-report';
import { useGetStatusBox } from '@/hooks/use-report'; // пока можем переиспользовать

export function ActionDropDownPallet({
  palletNumber,
  reportId,
  className = '',
}: {
  palletNumber: number;
  reportId: string;
  className: string;
}) {
  const { mutate: changeStatus } = useChangeStatusPallet();
  const { mutate: deletePallet } = useDeletePallet();
  const { mutate: unpackPallet } = useUnpackPallet();

  // пока используем тот же запрос для статусов, если на бэке они общие
  const {
    data: getStatus,
    isLoading: isGetStatusLoading,
    refetch: getRefetch,
  } = useGetStatusBox(palletNumber, reportId);

  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      {/* <DropdownMenuTrigger asChild>
        <div
          key={palletNumber}
          onClick={() => getRefetch()}
          className="bg-muted relative flex h-14 w-14 cursor-pointer items-center justify-center gap-0.5 rounded-lg border transition hover:bg-neutral-200 sm:h-16 sm:w-16"
        >
          <Package className="text-muted-foreground h-7 w-7 opacity-60 sm:h-8 sm:w-8" />
          <span className="text-foreground inset-0 flex items-center justify-center text-sm font-semibold sm:text-base">
            {palletNumber}
          </span>
        </div>
      </DropdownMenuTrigger> */}
      <DropdownMenuTrigger asChild>
        <div
          key={palletNumber}
          onClick={() => getRefetch()}
          className={`bg-muted relative flex h-14 w-14 cursor-pointer items-center justify-center gap-0.5 rounded-lg border transition hover:bg-neutral-200 sm:h-16 sm:w-16 ${className}`}
        >
          <Package className="text-muted-foreground h-7 w-7 opacity-60 sm:h-8 sm:w-8" />
          <span className="text-foreground inset-0 flex items-center justify-center text-sm font-semibold sm:text-base">
            {palletNumber}
          </span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Действия с паллетой #{palletNumber}</DropdownMenuLabel>
        <DropdownMenuGroup>
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
                          onClick={() => changeStatus({ palletNumber, reportId, status })}
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
            className="cursor-pointer"
            onClick={() => unpackPallet({ palletNumber, reportId })}
          >
            Расформировать паллету
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer text-red-600"
            onClick={() => deletePallet({ palletNumber, reportId })}
          >
            Удалить паллету
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
