// // components/SyncPanel.tsx
// import { useState, useEffect } from 'react';
// import { formatDistanceToNow } from 'date-fns';
// import { ru } from 'date-fns/locale';
// import { useQueryClient } from '@tanstack/react-query';
// import { useSync } from '@/hooks/use-sync-adb';

// // UI компоненты (используйте ваши или замените на div)
// const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
//   <div className={`rounded-lg border bg-white shadow-sm ${className}`}>{children}</div>
// );

// const CardHeader = ({
//   children,
//   className = '',
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => <div className={`border-b p-6 ${className}`}>{children}</div>;

// const CardTitle = ({
//   children,
//   className = '',
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;

// const CardDescription = ({
//   children,
//   className = '',
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;

// const CardContent = ({
//   children,
//   className = '',
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => <div className={`p-6 ${className}`}>{children}</div>;

// const Button = ({
//   children,
//   onClick,
//   disabled = false,
//   className = '',
//   variant = 'default',
// }: {
//   children: React.ReactNode;
//   onClick?: () => void;
//   disabled?: boolean;
//   className?: string;
//   variant?: 'default' | 'destructive' | 'outline';
// }) => {
//   const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors';
//   const variantClasses = {
//     default: 'bg-blue-600 text-white hover:bg-blue-700',
//     destructive: 'bg-red-600 text-white hover:bg-red-700',
//     outline: 'border border-gray-300 hover:bg-gray-50',
//   };

//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
//     >
//       {children}
//     </button>
//   );
// };

// const Badge = ({
//   children,
//   variant = 'default',
// }: {
//   children: React.ReactNode;
//   variant?: 'default' | 'destructive' | 'outline';
// }) => {
//   const variantClasses = {
//     default: 'bg-green-100 text-green-800',
//     destructive: 'bg-red-100 text-red-800',
//     outline: 'border border-gray-300',
//   };

//   return (
//     <span className={`rounded-full px-2 py-1 text-xs font-medium ${variantClasses[variant]}`}>
//       {children}
//     </span>
//   );
// };

// const Alert = ({
//   children,
//   variant = 'default',
// }: {
//   children: React.ReactNode;
//   variant?: 'default' | 'destructive';
// }) => {
//   const variantClasses = {
//     default: 'bg-blue-50 border-blue-200 text-blue-800',
//     destructive: 'bg-red-50 border-red-200 text-red-800',
//   };

//   return <div className={`rounded-lg border p-4 ${variantClasses[variant]}`}>{children}</div>;
// };

// const AlertTitle = ({ children }: { children: React.ReactNode }) => (
//   <div className="mb-1 font-medium">{children}</div>
// );

// const AlertDescription = ({ children }: { children: React.ReactNode }) => (
//   <div className="text-sm">{children}</div>
// );

// // Иконки (можно использовать lucide-react или SVG)
// const Icon = ({ name, className = '' }: { name: string; className?: string }) => {
//   const icons: Record<string, string> = {
//     smartphone: '📱',
//     database: '💾',
//     file: '📄',
//     check: '✅',
//     alert: '⚠️',
//     refresh: '🔄',
//     download: '📥',
//     info: 'ℹ️',
//     clock: '⏰',
//     external: '🔗',
//   };

//   return <span className={className}>{icons[name] || '?'}</span>;
// };

// const SyncPanel = () => {
//   const {
//     deviceStatus,
//     dbStats,
//     syncResult,
//     isLoading,
//     isDeviceLoading,
//     isDbLoading,
//     isSyncing,
//     error,
//     isDeviceConnected,
//     filesCount,
//     hasErrors,
//     startSync,
//     refreshDeviceStatus,
//     refreshDbStats,
//     clearSyncResult,
//   } = useSync();

//   const [lastChecked, setLastChecked] = useState<string>('');
//   const queryClient = useQueryClient();

//   // Обновляем время последней проверки
//   useEffect(() => {
//     if (deviceStatus?.lastCheck) {
//       setLastChecked(deviceStatus.lastCheck);
//     }
//   }, [deviceStatus]);

//   const formatDate = (dateString: string) => {
//     try {
//       return formatDistanceToNow(new Date(dateString), {
//         addSuffix: true,
//         locale: ru,
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   const handleStartSync = () => {
//     clearSyncResult();
//     startSync(undefined, {
//       onError: (err) => {
//         console.error('Sync failed:', err);
//       },
//     });
//   };

//   // Обработка ошибок
//   if (error && !isLoading) {
//     return (
//       <Card className="border-red-200">
//         <CardContent className="py-8 text-center">
//           <Icon name="alert" className="mb-3 text-3xl" />
//           <h3 className="mb-2 text-lg font-semibold text-red-800">Ошибка загрузки</h3>
//           <p className="text-red-600">{error.message}</p>
//           <Button
//             onClick={() => {
//               queryClient.invalidateQueries({ queryKey: syncKeys.all });
//             }}
//             className="mt-4"
//           >
//             Попробовать снова
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Заголовок */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <Icon name="smartphone" className="text-2xl" />
//           <div>
//             <h1 className="text-2xl font-bold">Синхронизация со складом</h1>
//             <p className="text-gray-600">
//               Выгрузка данных с Android устройства и обновление статусов
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <Badge variant={isDeviceConnected ? 'default' : 'destructive'}>
//             {isDeviceConnected ? 'Подключено' : 'Отключено'}
//           </Badge>

//           {lastChecked && (
//             <div className="flex items-center gap-1 text-sm text-gray-500">
//               <Icon name="clock" className="text-sm" />
//               {formatDate(lastChecked)}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Основной контент */}
//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         {/* Левая колонка */}
//         <div className="space-y-6 lg:col-span-2">
//           {/* Панель устройства */}
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Icon name="smartphone" />
//                   <CardTitle>Состояние устройства</CardTitle>
//                 </div>

//                 <Button onClick={refreshDeviceStatus} variant="outline" disabled={isDeviceLoading}>
//                   <Icon name="refresh" className="mr-2" />
//                   {isDeviceLoading ? 'Обновление...' : 'Обновить'}
//                 </Button>
//               </div>
//               <CardDescription>Статус подключения Android устройства</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {/* Статус подключения */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-1">
//                   <div className="text-sm text-gray-500">Подключение</div>
//                   <div className="flex items-center gap-2">
//                     {isDeviceConnected ? (
//                       <>
//                         <div className="h-2 w-2 rounded-full bg-green-500" />
//                         <span className="font-medium">Устройство подключено</span>
//                       </>
//                     ) : (
//                       <>
//                         <div className="h-2 w-2 rounded-full bg-red-500" />
//                         <span className="font-medium">Устройство отключено</span>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 <div className="space-y-1">
//                   <div className="text-sm text-gray-500">Файлов на устройстве</div>
//                   <div className="text-lg font-medium">{filesCount}</div>
//                 </div>
//               </div>

//               {/* Список файлов */}
//               {deviceStatus?.sampleFiles && deviceStatus.sampleFiles.length > 0 && (
//                 <div className="rounded-lg border bg-gray-50 p-3">
//                   <div className="mb-2 flex items-center gap-2">
//                     <Icon name="file" />
//                     <span className="text-sm font-medium">Найдены файлы:</span>
//                   </div>
//                   <div className="space-y-1">
//                     {deviceStatus.sampleFiles.map((file, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center gap-2 rounded border bg-white p-1.5 text-sm"
//                       >
//                         <div className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
//                         <span className="truncate">{file}</span>
//                       </div>
//                     ))}
//                     {deviceStatus.filesCount > 3 && (
//                       <div className="pt-1 text-center text-sm text-gray-500">
//                         и ещё {deviceStatus.filesCount - 3} файлов...
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Кнопка синхронизации */}
//               <div className="border-t pt-4">
//                 <Button
//                   onClick={handleStartSync}
//                   disabled={!isDeviceConnected || isSyncing || filesCount === 0}
//                   className="w-full"
//                 >
//                   <Icon name="download" className="mr-2" />
//                   {isSyncing ? 'Синхронизация...' : 'Запустить синхронизацию'}
//                 </Button>

//                 {filesCount === 0 && isDeviceConnected && (
//                   <div className="mt-2 text-center text-sm text-amber-600">
//                     На устройстве нет файлов для синхронизации
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Результаты синхронизации */}
//           {syncResult && (
//             <Card className={hasErrors ? 'border-amber-200' : 'border-green-200'}>
//               <CardHeader>
//                 <div className="flex items-center gap-2">
//                   <Icon name={hasErrors ? 'alert' : 'check'} />
//                   <CardTitle className={hasErrors ? 'text-amber-800' : 'text-green-800'}>
//                     Результаты синхронизации
//                   </CardTitle>
//                 </div>
//                 <CardDescription>{syncResult.message}</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {/* Статистика */}
//                 <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
//                   <div className="rounded-lg bg-gray-50 p-3 text-center">
//                     <div className="text-2xl font-bold">{syncResult.stats.filesProcessed}</div>
//                     <div className="text-sm text-gray-600">Файлов</div>
//                   </div>
//                   <div className="rounded-lg bg-gray-50 p-3 text-center">
//                     <div className="text-2xl font-bold">{syncResult.stats.reportsUpdated}</div>
//                     <div className="text-sm text-gray-600">Отчётов</div>
//                   </div>
//                   <div className="rounded-lg bg-gray-50 p-3 text-center">
//                     <div className="text-2xl font-bold">{syncResult.stats.palletsUpdated}</div>
//                     <div className="text-sm text-gray-600">Паллет</div>
//                   </div>
//                   <div className="rounded-lg bg-gray-50 p-3 text-center">
//                     <div className="text-2xl font-bold">{syncResult.stats.boxesUpdated}</div>
//                     <div className="text-sm text-gray-600">Коробок</div>
//                   </div>
//                   <div className="rounded-lg bg-gray-50 p-3 text-center">
//                     <div className="text-2xl font-bold">{syncResult.stats.codesUpdated}</div>
//                     <div className="text-sm text-gray-600">Кодов</div>
//                   </div>
//                 </div>

//                 {/* Ошибки */}
//                 {hasErrors && (
//                   <Alert variant="destructive">
//                     <AlertTitle>Обнаружены ошибки</AlertTitle>
//                     <AlertDescription>
//                       <div className="mt-2 space-y-2">
//                         {syncResult.errors.map((err, index) => (
//                           <div key={index} className="text-sm">
//                             <strong>{err.file}:</strong> {err.error}
//                           </div>
//                         ))}
//                       </div>
//                     </AlertDescription>
//                   </Alert>
//                 )}
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         {/* Правая колонка */}
//         <div className="space-y-6">
//           {/* Статистика БД */}
//           <Card>
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <Icon name="database" />
//                 <CardTitle>База данных</CardTitle>
//               </div>
//               <CardDescription>Текущее состояние системы</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {isDbLoading ? (
//                 <div className="py-6 text-center">
//                   <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
//                   <div className="text-gray-500">Загрузка статистики...</div>
//                 </div>
//               ) : dbStats ? (
//                 <>
//                   <div className="space-y-3">
//                     <div className="space-y-1">
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-600">Отчёты:</span>
//                         <span className="font-medium">{dbStats.reports}</span>
//                       </div>
//                     </div>

//                     <div className="space-y-1">
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-600">Коробки:</span>
//                         <span className="font-medium">{dbStats.boxes}</span>
//                       </div>
//                     </div>

//                     <div className="space-y-1">
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-600">Коды:</span>
//                         <span className="font-medium">{dbStats.codes}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <Button
//                     onClick={refreshDbStats}
//                     variant="outline"
//                     className="w-full"
//                     disabled={isDbLoading}
//                   >
//                     <Icon name="refresh" className="mr-2" />
//                     {isDbLoading ? 'Обновление...' : 'Обновить статистику'}
//                   </Button>
//                 </>
//               ) : (
//                 <div className="py-6 text-center text-gray-500">Нет данных</div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Инструкция */}
//           <Card>
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <Icon name="info" />
//                 <CardTitle>Инструкция</CardTitle>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-3 text-sm">
//               <div className="space-y-2">
//                 <div className="flex items-start gap-2">
//                   <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600">
//                     1
//                   </div>
//                   <span>Подключите Android устройство по USB</span>
//                 </div>

//                 <div className="flex items-start gap-2">
//                   <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600">
//                     2
//                   </div>
//                   <span>Включите "Отладку по USB" в настройках разработчика</span>
//                 </div>

//                 <div className="flex items-start gap-2">
//                   <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600">
//                     3
//                   </div>
//                   <span>Нажмите "Обновить" для проверки подключения</span>
//                 </div>

//                 <div className="flex items-start gap-2">
//                   <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600">
//                     4
//                   </div>
//                   <span>Нажмите "Запустить синхронизацию"</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SyncPanel;

// components/SyncPanel.tsx
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Smartphone,
  Database,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Download,
  Info,
  Clock,
  AlertTriangle,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { useSync, syncKeys } from '@/hooks/use-sync-adb';
import { ShipmentHeaderActions } from '../save-report-tauri';

const SyncPanel = () => {
  const {
    deviceStatus,
    dbStats,
    syncResult,
    isLoading,
    isDeviceLoading,
    isDbLoading,
    isSyncing,
    error,
    isDeviceConnected,
    filesCount,
    hasErrors,
    startSync,
    refreshDeviceStatus,
    refreshDbStats,
    clearSyncResult,
  } = useSync();

  const [lastChecked, setLastChecked] = useState<string>('');
  const queryClient = useQueryClient();

  // Обновляем время последней проверки
  useEffect(() => {
    if (deviceStatus?.lastCheck) {
      setLastChecked(deviceStatus.lastCheck);
    }
  }, [deviceStatus]);

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ru,
      });
    } catch {
      return dateString;
    }
  };

  const handleStartSync = () => {
    clearSyncResult();
    startSync(undefined, {
      onError: (err) => {
        console.error('Sync failed:', err);
      },
    });
  };
  console.log('deviceStatus', deviceStatus);
  console.log('dbStats', dbStats);
  console.log('syncResult', syncResult);

  // Обработка ошибок
  if (error && !isLoading) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="text-destructive mb-3 h-12 w-12" />
          <AlertTitle className="text-lg font-semibold">Ошибка загрузки</AlertTitle>
          <AlertDescription className="mt-2 text-center">{error.message}</AlertDescription>
          <Button
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: syncKeys.all });
            }}
            className="mt-4"
          >
            Попробовать снова
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 rounded-lg p-2">
            <Smartphone className="text-primary h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Синхронизация со складом</h1>
            <p className="text-muted-foreground">
              Выгрузка данных с Android устройства и обновление статусов
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isDeviceConnected ? 'default' : 'destructive'} className="gap-1.5">
            {isDeviceConnected ? (
              <>
                <CheckCircle2 className="h-3 w-3" />
                Подключено
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3" />
                Отключено
              </>
            )}
          </Badge>

          {lastChecked && (
            <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <Clock className="h-3.5 w-3.5" />
              {formatDate(lastChecked)}
            </div>
          )}
        </div>
      </div>

      {/* Основной контент */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Левая колонка */}
        <div className="space-y-6 lg:col-span-2">
          {/* Панель устройства */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  <CardTitle>Состояние устройства</CardTitle>
                </div>

                <Button
                  onClick={refreshDeviceStatus}
                  variant="outline"
                  size="sm"
                  disabled={isDeviceLoading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isDeviceLoading ? 'animate-spin' : ''}`} />
                  {isDeviceLoading ? 'Обновление...' : 'Обновить'}
                </Button>
              </div>
              <CardDescription>Статус подключения Android устройства</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Статус подключения */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Подключение</div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${isDeviceConnected ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                    <span className="text-sm">
                      {isDeviceConnected ? 'Устройство подключено' : 'Устройство отключено'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Файлов на устройстве</div>
                  <div className="text-2xl font-bold">{filesCount}</div>
                </div>
              </div>

              {/* Список файлов */}
              {deviceStatus?.sampleFiles && deviceStatus.sampleFiles.length > 0 && (
                <div className="bg-muted/50 rounded-lg border p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <FileText className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Найдены файлы:</span>
                  </div>
                  <div className="space-y-2">
                    {deviceStatus.sampleFiles.map((file, index) => (
                      <div
                        key={index}
                        className="bg-background flex items-center gap-2 rounded-md border p-2.5 text-sm"
                      >
                        <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                        <span className="truncate font-mono text-xs">{file}</span>
                        <ShipmentHeaderActions filename={file} />
                      </div>
                    ))}
                    {deviceStatus.filesCount > 3 && (
                      <div className="text-muted-foreground pt-1 text-center text-xs">
                        и ещё {deviceStatus.filesCount - 3} файлов...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Кнопка синхронизации */}
              <div className="border-t pt-4">
                <Button
                  onClick={handleStartSync}
                  disabled={!isDeviceConnected || isSyncing || filesCount === 0}
                  className="w-full"
                  size="lg"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Синхронизация...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Запустить синхронизацию
                    </>
                  )}
                </Button>

                {filesCount === 0 && isDeviceConnected && (
                  <div className="mt-3 text-center text-sm text-amber-600">
                    На устройстве нет файлов для синхронизации
                  </div>
                )}

                {!isDeviceConnected && (
                  <div className="text-muted-foreground mt-3 text-center text-sm">
                    Подключите устройство для начала синхронизации
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Результаты синхронизации */}
          {syncResult && (
            <Card className={hasErrors ? 'border-amber-200' : 'border-green-200'}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {hasErrors ? (
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                  <CardTitle className={hasErrors ? 'text-amber-800' : 'text-green-800'}>
                    Результаты синхронизации
                  </CardTitle>
                </div>
                <CardDescription>{syncResult.message}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Статистика */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                  <div className="bg-muted/30 flex flex-col items-center rounded-lg border p-4">
                    <div className="text-2xl font-bold">{syncResult.stats.filesProcessed}</div>
                    <div className="text-muted-foreground text-xs">Файлов</div>
                  </div>
                  <div className="bg-muted/30 flex flex-col items-center rounded-lg border p-4">
                    <div className="text-2xl font-bold">{syncResult.stats.reportsUpdated}</div>
                    <div className="text-muted-foreground text-xs">Отчётов</div>
                  </div>
                  <div className="bg-muted/30 flex flex-col items-center rounded-lg border p-4">
                    <div className="text-2xl font-bold">{syncResult.stats.palletsUpdated}</div>
                    <div className="text-muted-foreground text-xs">Паллет</div>
                  </div>
                  <div className="bg-muted/30 flex flex-col items-center rounded-lg border p-4">
                    <div className="text-2xl font-bold">{syncResult.stats.boxesUpdated}</div>
                    <div className="text-muted-foreground text-xs">Коробок</div>
                  </div>
                  <div className="bg-muted/30 flex flex-col items-center rounded-lg border p-4">
                    <div className="text-2xl font-bold">{syncResult.stats.codesUpdated}</div>
                    <div className="text-muted-foreground text-xs">Кодов</div>
                  </div>
                </div>

                {/* Прогресс (если нужно) */}
                {syncResult.stats.filesProcessed > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Прогресс обработки</span>
                      <span className="font-medium">{syncResult.stats.filesProcessed} файлов</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                )}

                {/* Ошибки */}
                {hasErrors && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Обнаружены ошибки</AlertTitle>
                    <AlertDescription>
                      <div className="mt-2 space-y-2">
                        {syncResult.errors.map((err, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{err.file}:</span>{' '}
                            <span className="text-muted-foreground">{err.error}</span>
                          </div>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Правая колонка */}
        <div className="space-y-6">
          {/* Статистика БД */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <CardTitle>База данных</CardTitle>
              </div>
              <CardDescription>Текущее состояние системы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isDbLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="text-primary mb-3 h-8 w-8 animate-spin" />
                  <div className="text-muted-foreground text-sm">Загрузка статистики...</div>
                </div>
              ) : dbStats ? (
                <>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Отчёты</span>
                        <span className="font-medium">{dbStats.reports.toLocaleString()}</span>
                      </div>
                      <Progress value={dbStats.reports > 0 ? 100 : 0} className="h-1.5" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Коробки</span>
                        <span className="font-medium">{dbStats.boxes.toLocaleString()}</span>
                      </div>
                      <Progress value={dbStats.boxes > 0 ? 100 : 0} className="h-1.5" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Коды</span>
                        <span className="font-medium">{dbStats.codes.toLocaleString()}</span>
                      </div>
                      <Progress value={dbStats.codes > 0 ? 100 : 0} className="h-1.5" />
                    </div>
                  </div>

                  <Button
                    onClick={refreshDbStats}
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={isDbLoading}
                  >
                    <RefreshCw
                      className={`mr-2 h-3.5 w-3.5 ${isDbLoading ? 'animate-spin' : ''}`}
                    />
                    Обновить статистику
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertCircle className="text-muted-foreground mb-3 h-8 w-8" />
                  <div className="text-muted-foreground text-sm">Нет данных</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Инструкция */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                <CardTitle>Инструкция</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  'Подключите Android устройство по USB',
                  'Включите "Отладку по USB" в настройках разработчика',
                  'Нажмите "Обновить" для проверки подключения',
                  'Нажмите "Запустить синхронизацию"',
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="text-sm leading-tight">{step}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <a
                  href="https://developer.android.com/studio/command-line/adb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary inline-flex items-center gap-1.5 text-xs hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Документация ADB
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Быстрые действия */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: syncKeys.all });
                  refreshDeviceStatus();
                  refreshDbStats();
                }}
              >
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                Обновить все данные
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(
                      {
                        deviceStatus,
                        dbStats,
                        syncResult,
                      },
                      null,
                      2,
                    ),
                  );
                }}
              >
                <FileText className="mr-2 h-3.5 w-3.5" />
                Скопировать данные
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SyncPanel;
