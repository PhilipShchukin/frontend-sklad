import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle } from 'lucide-react';
import { useFiles, useFinalizeShipmentFile } from '@/hooks/use-shipment';

export const PortalShip = () => {
  const { data, refetch, isFetching } = useFiles();
  const { mutate: finalize } = useFinalizeShipmentFile();

  return (
    <Card className="max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Доступные файлы</CardTitle>

        <Button size="sm" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? 'Загрузка...' : 'Загрузить'}
        </Button>
      </CardHeader>

      <CardContent className="space-y-2">
        {!data && (
          <p className="text-muted-foreground text-sm">
            Нажмите «Загрузить», чтобы получить список файлов
          </p>
        )}

        {data?.length === 0 && <p className="text-muted-foreground text-sm">Файлы не найдены</p>}

        {data?.map((file) => (
          <div
            key={file.name}
            className="hover:bg-muted flex items-center justify-between gap-3 rounded-md border px-4 py-2 transition"
          >
            <div className="flex items-center gap-3">
              <FileText className="text-muted-foreground h-4 w-4" />
              <span className="truncate text-sm font-medium">{file.name}</span>
            </div>

            <Button size="sm" variant="secondary" onClick={() => finalize(file.name)}>
              <CheckCircle className="mr-1 h-4 w-4" />
              Финализировать
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
