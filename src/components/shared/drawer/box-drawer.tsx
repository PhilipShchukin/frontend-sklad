import * as React from 'react';
import { Grip, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ActionDropDown } from './action-dropdown';
import type { Status } from '@/services/constants';
import type { Code } from '@/types/pages-types/report-types';

// type ProductCode = {
//   id: string;
//   code: string;
//   boxNumber: number;
//   palletNumber: number;
//   status: Status;
//   boxLabel: string;
//   palletLabel: string;
//   reportId: string;
// };

export function BoxDrawer({ codes }: { codes: Code[] }) {
  const [expanded, setExpanded] = React.useState(false);
  const gridRef = React.useRef<HTMLDivElement>(null);

  // Уникальные коробки
  const uniqueBoxes = Array.from(new Map(codes.map((c) => [c.boxNumber, c])).values());

  // Ограничение для "свернутого" вида
  const VISIBLE_LIMIT = 24;
  //   const SCROLL_LIMIT = 150;
  const SCROLL_LIMIT = 40;

  const visibleBoxes = expanded ? uniqueBoxes : uniqueBoxes.slice(0, VISIBLE_LIMIT);

  // При закрытии "Показать больше" возвращаем скролл к началу
  React.useEffect(() => {
    if (!expanded && gridRef.current) {
      gridRef.current.scrollTop = 0;
    }
  }, [expanded]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Grip className="cursor-pointer pt-1" size={18} />
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerHeader>
          <DrawerTitle className="flex items-center justify-center gap-2">
            <Package className="h-5 w-5" /> Коробки
          </DrawerTitle>
        </DrawerHeader>

        {/* Сетка коробок */}
        <div
          ref={gridRef}
          className={`mt-4 grid grid-cols-5 gap-1 sm:grid-cols-6 sm:gap-2 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 ${expanded && uniqueBoxes.length > SCROLL_LIMIT ? 'max-h-[500px] overflow-y-auto pr-1' : ''} `}
        >
          {visibleBoxes.map((box) => (
            <ActionDropDown boxNumber={box.boxNumber} reportId={box.reportId} />
          ))}
        </div>

        {/* Кнопка показать больше */}
        {uniqueBoxes.length > VISIBLE_LIMIT && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              className="cursor-pointer"
              size="sm"
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? 'Скрыть' : 'Показать больше'}
            </Button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
