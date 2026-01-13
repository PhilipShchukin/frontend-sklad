import { FileText, AlertTriangle, Clock } from 'lucide-react';
import SyncPanel from '../shared/sync-panel/sync-panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SyncPage() {
  return (
    <div className="bg-background min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <SyncPanel />

        {/* Дополнительная информация */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-base">Логи синхронизации</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Все операции логируются в папке{' '}
                <code className="bg-muted rounded px-1 py-0.5 text-xs">./sync_logs</code> на сервере
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-base">В случае ошибок</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-1.5 text-sm">
                <li className="flex items-center gap-1.5">
                  <div className="bg-muted-foreground h-1 w-1 rounded-full" />
                  Проверьте подключение USB
                </li>
                <li className="flex items-center gap-1.5">
                  <div className="bg-muted-foreground h-1 w-1 rounded-full" />
                  Убедитесь что ADB установлен
                </li>
                <li className="flex items-center gap-1.5">
                  <div className="bg-muted-foreground h-1 w-1 rounded-full" />
                  Перезагрузите устройство
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-500" />
                <CardTitle className="text-base">Время работы</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Синхронизация обычно занимает 1-2 минуты в зависимости от количества файлов
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
