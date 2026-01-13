export async function exportToTerminal(task: any) {
  const fileName = `task-${task.applicationNumber}.json`;
  const fileContent = JSON.stringify(task, null, 2);

  try {
    // Запрашиваем доступ к каталогу терминала (его выберет пользователь)
    const dirHandle = await (window as any).showDirectoryPicker();

    const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });

    const writable = await fileHandle.createWritable();
    await writable.write(fileContent);
    await writable.close();

    return { success: true, message: `Задание сохранено как ${fileName}` };
  } catch (error) {
    console.error('Ошибка экспорта:', error);
    return { success: false, message: 'Не удалось записать файл на терминал.' };
  }
}
