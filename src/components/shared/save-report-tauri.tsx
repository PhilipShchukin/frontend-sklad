import { Button } from '@/components/ui/button';
import {
  useGenerateCsv,
  useGenerateTxt,
  useGenerateXlsx,
  useGenerateXml,
} from '@/hooks/use-generate-xml';
import { save } from '@tauri-apps/plugin-dialog'; // ✅ Диалог из плагина [citation:9]
import { writeTextFile } from '@tauri-apps/plugin-fs'; // ✅ ФС из плагина [citation:1]
import { toast } from 'sonner'; // или другая библиотека уведомлений

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontalIcon } from 'lucide-react';

export function ShipmentHeaderActions({ filename }: { filename: string }) {
  const { mutate: mutateXml, isPending: isPendingXml } = useGenerateXml();
  const { mutate: mutateCsv, isPending: isPendingCsv } = useGenerateCsv();
  const { mutate: mutateTxt, isPending: isPendingTxt } = useGenerateTxt();
  const { mutate: mutateXlsx, isPending: isPendingXlsx } = useGenerateXlsx();

  const handleClickXml = async () => {
    mutateXml(filename, {
      onSuccess: async (serverResponse) => {
        // Сервер возвращает объект { xml, fileName, localPath }
        const xmlContent = serverResponse.xml; // ⬅️ Достаем строку XML напрямую

        // 1. Открываем окно "Сохранить как"
        const selectedPath = await save({
          filters: [{ name: 'XML Files', extensions: ['xml'] }],
          defaultPath: serverResponse.fileName || 'shipment.xml', // Предлагаем имя с сервера
        });

        if (!selectedPath) {
          // Пользователь нажал "Отмена"
          return;
        }

        try {
          // 2. Сохраняем XML в выбранный файл
          await writeTextFile(selectedPath, xmlContent); // [citation:1]

          // 3. Уведомление об успехе
          toast.success('XML файл успешно сохранён', {
            description: `Путь: ${selectedPath}`,
          });
          console.log('Файл сохранён:', selectedPath);

          // 4. (Опционально) Открываем папку с файлом
          // Если нужно, подключите и используйте @tauri-apps/plugin-shell
          // const { open } = await import('@tauri-apps/plugin-shell');
          // await open(selectedPath);
        } catch (error) {
          console.error('Ошибка сохранения:', error);
          toast.error('Не удалось сохранить файл');
        }
      },
      onError: (error) => {
        // toast.error('Ошибка при генерации XML');
        toast.error(error.message);
        console.error(error);
      },
    });
  };

  const handleClickCsv = async () => {
    mutateCsv(filename, {
      onSuccess: async (serverResponse) => {
        // Сервер возвращает объект { xml, fileName, localPath }
        const csvContent = serverResponse.csv; // ⬅️ Достаем строку XML напрямую

        // 1. Открываем окно "Сохранить как"
        const selectedPath = await save({
          filters: [{ name: 'XML Files', extensions: ['csv'] }],
          defaultPath: serverResponse.fileName || 'shipment.csv', // Предлагаем имя с сервера
        });

        if (!selectedPath) {
          // Пользователь нажал "Отмена"
          return;
        }

        try {
          // 2. Сохраняем XML в выбранный файл
          await writeTextFile(selectedPath, csvContent); // [citation:1]

          // 3. Уведомление об успехе
          toast.success('CSV файл успешно сохранён', {
            description: `Путь: ${selectedPath}`,
          });
          console.log('Файл сохранён:', selectedPath);

          // 4. (Опционально) Открываем папку с файлом
          // Если нужно, подключите и используйте @tauri-apps/plugin-shell
          // const { open } = await import('@tauri-apps/plugin-shell');
          // await open(selectedPath);
        } catch (error) {
          console.error('Ошибка сохранения:', error);
          toast.error('Не удалось сохранить файл');
        }
      },
      onError: (error) => {
        // toast.error('Ошибка при генерации XML');
        toast.error(error.message);
        console.error(error);
      },
    });
  };

  const handleClickTxt = async () => {
    mutateTxt(filename, {
      onSuccess: async (serverResponse) => {
        // Сервер возвращает объект { xml, fileName, localPath }
        const txtContent = serverResponse.txt; // ⬅️ Достаем строку XML напрямую

        // 1. Открываем окно "Сохранить как"
        const selectedPath = await save({
          filters: [{ name: 'TXT Files', extensions: ['txt'] }],
          defaultPath: serverResponse.fileName || 'shipment.txt', // Предлагаем имя с сервера
        });

        if (!selectedPath) {
          // Пользователь нажал "Отмена"
          return;
        }

        try {
          // 2. Сохраняем XML в выбранный файл
          await writeTextFile(selectedPath, txtContent); // [citation:1]

          // 3. Уведомление об успехе
          toast.success('TXT файл успешно сохранён', {
            description: `Путь: ${selectedPath}`,
          });
          console.log('Файл сохранён:', selectedPath);

          // 4. (Опционально) Открываем папку с файлом
          // Если нужно, подключите и используйте @tauri-apps/plugin-shell
          // const { open } = await import('@tauri-apps/plugin-shell');
          // await open(selectedPath);
        } catch (error) {
          console.error('Ошибка сохранения:', error);
          toast.error('Не удалось сохранить файл');
        }
      },
      onError: (error) => {
        // toast.error('Ошибка при генерации XML');
        toast.error(error.message);
        console.error(error);
      },
    });
  };

  const handleClickXlsx = async () => {
    mutateXlsx(filename, {
      onSuccess: async (serverResponse) => {
        // Сервер возвращает объект { xml, fileName, localPath }
        const xlsxContent = serverResponse.xlsx; // ⬅️ Достаем строку XML напрямую

        // 1. Открываем окно "Сохранить как"
        const selectedPath = await save({
          filters: [{ name: 'XLSX Files', extensions: ['xlsx'] }],
          defaultPath: serverResponse.fileName || 'shipment.xlsx', // Предлагаем имя с сервера
        });

        if (!selectedPath) {
          // Пользователь нажал "Отмена"
          return;
        }

        try {
          // 2. Сохраняем XML в выбранный файл
          await writeTextFile(selectedPath, xlsxContent); // [citation:1]

          // 3. Уведомление об успехе
          toast.success('XLSX файл успешно сохранён', {
            description: `Путь: ${selectedPath}`,
          });
          console.log('Файл сохранён:', selectedPath);

          // 4. (Опционально) Открываем папку с файлом
          // Если нужно, подключите и используйте @tauri-apps/plugin-shell
          // const { open } = await import('@tauri-apps/plugin-shell');
          // await open(selectedPath);
        } catch (error) {
          console.error('Ошибка сохранения:', error);
          toast.error('Не удалось сохранить файл');
        }
      },
      onError: (error) => {
        // toast.error('Ошибка при генерации XML');
        toast.error(error.message);
        console.error(error);
      },
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {' '}
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem>
          <Button onClick={handleClickXml} disabled={isPendingXml}>
            {isPendingXml ? 'Генерация...' : 'XML-по умолчанию'}
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button onClick={handleClickCsv} disabled={isPendingCsv}>
            {isPendingCsv ? 'Генерация...' : 'CSV'}
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button onClick={handleClickTxt} disabled={isPendingTxt}>
            {isPendingTxt ? 'Генерация...' : 'TXT'}
          </Button>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Button onClick={handleClickXlsx} disabled={isPendingXlsx}>
            {isPendingXlsx ? 'Генерация...' : 'XLSX'}
          </Button>
        </DropdownMenuItem>
        {/* <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Team</DropdownMenuItem>
    <DropdownMenuItem>Subscription</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
