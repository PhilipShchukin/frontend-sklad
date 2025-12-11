// import { Button } from '@/components/ui/button';
// import { useGenerateXml } from '@/hooks/use-generate-xml';

// import { save } from '@tauri-apps/plugin-dialog';
// import { writeFile } from '@tauri-apps/plugin-fs';

// export function ShipmentHeaderActions(filename: string) {
//   const generateXml = useGenerateXml();

//   const { mutate } = useGenerateXml();

//   const handleClick = async () => {
//     mutate(filename, {
//       onSuccess: async (res) => {
//         // сервер возвращает XML строку
//         const xml = res.data;

//         // 📌 Открываем окно "Сохранить как"
//         const filePath = await save({
//           defaultPath: 'shipment.xml',
//           filters: [{ name: 'XML files', extensions: ['xml'] }],
//         });

//         if (!filePath) return; // пользователь нажал Отмена

//         // 📌 Сохранение файла
//         await writeFile(filePath, xml);

//         // уведомление
//         console.log('XML сохранён:', filePath);
//       },
//     });
//   };

//   return (
//     <Button onClick={handleClick} disabled={generateXml.isPending}>
//       {generateXml.isPending ? 'Генерация...' : 'Сохранить XML'}
//     </Button>
//   );
// }

// components/ShipmentHeaderActions.tsx
// import { Button } from '@/components/ui/button';
// import { useGenerateXml } from '@/hooks/use-generate-xml';
// import { save } from '@tauri-apps/plugin-dialog';
// import { writeTextFile } from '@tauri-apps/plugin-fs';
// import { toast } from 'sonner'; // или ваш вариант уведомлений

// interface ShipmentHeaderActionsProps {
//   filename: string;
// }

// export function ShipmentHeaderActions({ filename }: ShipmentHeaderActionsProps) {
//   const { mutate, isPending } = useGenerateXml();

//   const handleClick = async () => {
//     mutate(filename, {
//       onSuccess: async (response) => {
//         // response уже является объектом { xml, fileName, localPath }
//         const xmlContent = response.xml;

//         // 📌 Подготавливаем имя файла из ответа сервера
//         const defaultFileName = response.fileName || 'shipment.xml';

//         // 📌 Открываем окно "Сохранить как"
//         const filePath = await save({
//           defaultPath: defaultFileName,
//           filters: [{ name: 'XML files', extensions: ['xml'] }],
//         });

//         if (!filePath) {
//           toast.info('Сохранение отменено');
//           return; // пользователь нажал Отмена
//         }

//         try {
//           // 📌 Сохранение файла (используем writeTextFile для текстовых файлов)
//           await writeTextFile(filePath, xmlContent);

//           // 📌 Уведомление об успехе
//           toast.success('XML файл успешно сохранён', {
//             description: `Файл: ${filePath}`,
//             action: {
//               label: 'Открыть папку',
//               onClick: async () => {
//                 // Открываем папку с файлом
//                 const { open } = await import('@tauri-apps/plugin-shell');
//                 await open(filePath);
//               },
//             },
//           });

//           console.log('XML сохранён:', filePath);
//         } catch (error) {
//           console.error('Ошибка сохранения файла:', error);
//           toast.error('Ошибка при сохранении файла', {
//             description: error instanceof Error ? error.message : 'Неизвестная ошибка',
//           });
//         }
//       },
//       onError: (error) => {
//         console.error('Ошибка генерации XML:', error);
//         toast.error('Ошибка генерации XML', {
//           description: error.message,
//         });
//       },
//     });
//   };

//   return (
//     <Button
//       onClick={handleClick}
//       disabled={isPending}
//       variant="default"
//       className="gap-2"
//     >
//       {isPending ? 'Генерация...' : 'Сохранить XML'}
//     </Button>
//   );
// }

// components/ShipmentHeaderActions.tsx
import { Button } from '@/components/ui/button';
import { useGenerateXml } from '@/hooks/use-generate-xml';
import { save } from '@tauri-apps/plugin-dialog'; // ✅ Диалог из плагина [citation:9]
import { writeTextFile } from '@tauri-apps/plugin-fs'; // ✅ ФС из плагина [citation:1]
import { toast } from 'sonner'; // или другая библиотека уведомлений

export function ShipmentHeaderActions({ filename }: { filename: string }) {
  const { mutate, isPending } = useGenerateXml();

  const handleClick = async () => {
    mutate(filename, {
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
        toast.error('Ошибка при генерации XML');
        console.error(error);
      },
    });
  };

  return (
    <Button onClick={handleClick} disabled={isPending}>
      {isPending ? 'Генерация...' : 'Сохранить XML'}
    </Button>
  );
}
