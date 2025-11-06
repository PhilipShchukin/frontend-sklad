// components/ReportModal/ReportModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import type { ReportGet } from '@/types/pages-types/report-types';
import { BoxDrawer } from '../drawer/box-drawer';
import { PalletDrawer } from '../drawer/pallet-drawer';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ReportGet | null;
}

export function ReportModal({ isOpen, onClose, report }: ReportModalProps) {
  if (!report) return null;

  const uniquePallets = Array.from(new Map(report.codes.map((c) => [c.palletNumber, c])).values());

  // console.log('uniquePallets', uniquePallets.length);
  // console.log('codes', report.codes.length);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{report.name}</DialogTitle>
          {/* <DialogDescription className="sr-only">
            Детальная информация о отчете {report.name}
          </DialogDescription> */}
        </DialogHeader>

        {report && (
          <Card className="border shadow-sm">
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <p>
                  <b>Начало фасовки:</b> {report.startDate}
                </p>
                <p>
                  <b>Окончание фасовки:</b> {report.endDate}
                </p>

                <p>
                  <b>Дата производства:</b> {report.manufactureDate}
                </p>
                <p>
                  <b>Срок годности:</b> {report.bbd}
                </p>

                <p>
                  <b>GTIN:</b> {report.gtin}
                </p>
                <p>
                  <b>Партия:</b> {report.batch}
                </p>

                <p>
                  <b>Название:</b> {report.name}
                </p>
                <p>
                  <b>Описание:</b> {report.description.toLowerCase()}
                </p>

                <p className="flex gap-1">
                  <b>Количество коробок: </b>
                  <div className="flex gap-0.5">
                    {report.codes.length}
                    <BoxDrawer codes={report.codes} />
                  </div>
                </p>
                <p className="flex gap-1">
                  <b>Количество паллет: </b>
                  <div className="flex gap-0.5">
                    {uniquePallets.length}
                    <PalletDrawer codes={report.codes} />
                  </div>
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="cursor-pointer">
                      Удалить
                    </Button>
                  </AlertDialogTrigger>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}

// <div className="space-y-4">
//           {report.description && (
//             <div>
//               <h3 className="font-semibold">Описание</h3>
//               <p className="text-gray-600">{report.description}</p>
//             </div>
//           )}

//           <div>
//             <h3 className="font-semibold">Дата создания</h3>
//             <p className="text-gray-600">
//               {new Date(report.startDate).toLocaleDateString('ru-RU')}
//             </p>
//           </div>

//           <div>
//             <h3 className="font-semibold">ID отчета</h3>
//             <p className="text-gray-600">{report.id}</p>
//           </div>

//           {/* Добавьте другие поля отчета */}
//         </div>
