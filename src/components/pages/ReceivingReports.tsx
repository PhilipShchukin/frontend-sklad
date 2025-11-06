import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ReportMeta, Report } from '@/types/pages-types/report-types';
import { CircleQuestionMark, Loader2 } from 'lucide-react';
import { usePushReportDB } from '@/hooks/use-report';

export default function ReceivingReports() {
  const [reports, setReports] = useState<ReportMeta[]>([]);
  const [selected, setSelected] = useState<Report | null>(null);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const fetchReports = async () => {
    const data: ReportMeta[] = await invoke('list_reports');
    setReports(data);
    setSelected(null);
  };

  const fetchReportDetails = async (filename: string) => {
    const data: Report = await invoke('read_report', { filename });
    if (data) {
      setSelected({ ...data, filename });
    }
  };

  const deleteReport = async () => {
    if (!selected) return;
    const success: boolean = await invoke('delete_report', {
      filename: selected.filename,
    });
    if (success) {
      await fetchReports();
      setOpenDelete(false);
    }
  };
  const { mutate } = usePushReportDB();
  const addToDatabase = async () => {
    if (!selected) return;
    setLoadingAdd(true);
    try {
      // Здесь логика добавления в базу
      mutate(selected);
    } finally {
      setLoadingAdd(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Отчёты</h1>
        <Button onClick={fetchReports} className="cursor-pointer">
          Обновить
        </Button>
      </div>

      {/* Таблица файлов */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70%]">Имя файла</TableHead>
              <TableHead>Партия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow
                key={report.filename}
                className={cn(
                  'hover:bg-muted cursor-pointer transition',
                  selected?.filename === report.filename && 'bg-accent',
                )}
                onClick={() => fetchReportDetails(report.filename)}
              >
                <TableCell className="font-medium">
                  {report.filename.replace(/\.json$/, '').toLowerCase()}
                </TableCell>
                <TableCell>{report.Batch}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Детали выбранного */}
      {selected && (
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Детали отчёта {selected.filename.replace(/\.json$/, '')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <p>
                <b>Начало фасовки:</b> {selected.StartDate}
              </p>
              <p>
                <b>Окончание фасовки:</b> {selected.EndDate}
              </p>

              <p>
                <b>Дата производства:</b> {selected.ManufactureDate}
              </p>
              <p>
                <b>Срок годности:</b> {selected.BBD}
              </p>

              <p>
                <b>GTIN:</b> {selected.gtin}
              </p>
              <p>
                <b>Партия:</b> {selected.Batch}
              </p>

              <p>
                <b>Название:</b> {selected.Name}
              </p>
              <p>
                <b>Описание:</b> {selected.description.toLowerCase()}
              </p>

              <p>
                <b>Количество коробок:</b> {selected.units.boxes.length}
              </p>
              <p>
                <b>Количество паллет:</b> {selected.units.pallets.length}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant={'outline'}
                onClick={addToDatabase}
                disabled={loadingAdd}
                className="cursor-pointer hover:bg-emerald-400 hover:text-white"
              >
                {loadingAdd && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loadingAdd ? 'Загрузка...' : 'Добавить в базу'}
              </Button>
              {/* <Button variant="destructive" className="cursor-pointer" onClick={deleteReport}>
                Удалить
              </Button> */}
              <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="cursor-pointer">
                    Удалить
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Удалить отчёт?</AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                      <div className="flex">
                        Вы действительно хотите удалить отчёт
                        <CircleQuestionMark className="ml-1" />
                      </div>
                      <b>{selected.filename.replace(/\.json$/, '')}</b>
                      <br /> Это действие необратимо.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteReport} className="bg-destructive text-white">
                      Удалить
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
