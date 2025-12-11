// import * as React from 'react';
// import { Grip, Boxes } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from '@/components/ui/drawer';
// import type { Code } from '@/types/pages-types/report-types';
// import { ActionDropDownPallet } from './action-dropdown-pallet';

// export function PalletDrawer({ codes }: { codes: Code[] }) {
//   const [expanded, setExpanded] = React.useState(false);
//   const gridRef = React.useRef<HTMLDivElement>(null);

//   // Уникальные паллеты
//   const uniquePallets = Array.from(new Map(codes.map((c) => [c.palletNumber, c])).values());

//   // Ограничение для "свернутого" вида
//   const VISIBLE_LIMIT = 24;
//   const SCROLL_LIMIT = 40;

//   const visiblePallet = expanded ? uniquePallets : uniquePallets.slice(0, VISIBLE_LIMIT);

//   // При закрытии "Показать больше" возвращаем скролл к началу
//   React.useEffect(() => {
//     if (!expanded && gridRef.current) {
//       gridRef.current.scrollTop = 0;
//     }
//   }, [expanded]);

//   return (
//     <Drawer>
//       <DrawerTrigger asChild>
//         <Grip className="cursor-pointer pt-1" size={18} />
//       </DrawerTrigger>
//       <DrawerContent className="p-4">
//         <DrawerHeader>
//           <DrawerTitle className="flex items-center justify-center gap-2">
//             <Boxes className="h-5 w-5" /> Паллеты
//           </DrawerTitle>
//         </DrawerHeader>

//         {/* Сетка паллет */}
//         <div
//           ref={gridRef}
//           className={`mt-4 grid grid-cols-5 gap-1 sm:grid-cols-6 sm:gap-2 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 ${expanded && uniquePallets.length > SCROLL_LIMIT ? 'max-h-[500px] overflow-y-auto pr-1' : ''} `}
//         >
//           {visiblePallet.map((pallet) => (
//             <ActionDropDownPallet palletNumber={pallet.palletNumber} reportId={pallet.reportId} />
//           ))}
//         </div>

//         {/* Кнопка показать больше */}
//         {uniquePallets.length > VISIBLE_LIMIT && (
//           <div className="mt-4 flex justify-center">
//             <Button
//               variant="outline"
//               className="cursor-pointer"
//               size="sm"
//               onClick={() => setExpanded((prev) => !prev)}
//             >
//               {expanded ? 'Скрыть' : 'Показать больше'}
//             </Button>
//           </div>
//         )}
//       </DrawerContent>
//     </Drawer>
//   );
// }

import * as React from 'react';
import { Grip, Boxes } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ActionDropDownPallet } from './action-dropdown-pallet';

type Pallet = {
  id: string;
  palletNumber: number;
  palletLabel: string;
  status: 'ACTIVE' | 'EMPTY' | 'ARCHIVED';
  reportId: string;
};

export function PalletDrawer({ pallets }: { pallets: Pallet[] }) {
  const [expanded, setExpanded] = React.useState(false);
  const gridRef = React.useRef<HTMLDivElement>(null);

  // Уникальные паллеты (по palletNumber)
  const uniquePallets = Array.from(new Map(pallets.map((p) => [p.palletNumber, p])).values());

  // Ограничение для "свернутого" вида
  const VISIBLE_LIMIT = 24;
  const SCROLL_LIMIT = 40;

  const visiblePallet = expanded ? uniquePallets : uniquePallets.slice(0, VISIBLE_LIMIT);

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
            <Boxes className="h-5 w-5" /> Паллеты
          </DrawerTitle>
        </DrawerHeader>

        {/* Сетка паллет */}
        <div
          ref={gridRef}
          className={`mt-4 grid grid-cols-5 gap-1 sm:grid-cols-6 sm:gap-2 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 ${
            expanded && uniquePallets.length > SCROLL_LIMIT
              ? 'max-h-[500px] overflow-y-auto pr-1'
              : ''
          } `}
        >
          {visiblePallet.map((pallet) => {
            return (
              <ActionDropDownPallet
                key={pallet.palletNumber}
                palletNumber={pallet.palletNumber}
                reportId={pallet.reportId}
                // className={pallet.status === 'EMPTY' ? 'bg-red-300 text-gray-500' : ''}
                className={
                  pallet.status === 'EMPTY' ? 'bg-red-200 text-gray-500 hover:bg-red-300' : ''
                }
              />
            );
          })}
        </div>

        {/* Кнопка показать больше */}
        {uniquePallets.length > VISIBLE_LIMIT && (
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
