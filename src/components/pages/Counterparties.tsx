import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Building, Plus, X } from 'lucide-react';
import CounterpartiesList from '@/components/shared/table/counterparties/counterparties-list';
import CounterpartiesForm from '@/components/shared/table/counterparties/counterparties-form';

const Counterparties: React.FC = () => {
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Функция для перехода к созданию нового контрагента
  const handleCreate = () => {
    setMode('create');
    setEditingId(null);
  };

  // Функция для перехода к редактированию
  const handleEdit = (id: string) => {
    setMode('edit');
    setEditingId(id);
  };

  // Функция для возврата к списку
  const handleBackToList = () => {
    setMode('list');
    setEditingId(null);
  };

  return (
    <div className="container mx-auto p-6">
      {mode === 'list' ? (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div>
              {/* <h1 className="flex items-center gap-3 text-3xl font-bold">
                <Building className="h-8 w-8" />
                Контрагенты
              </h1> */}
              <p className="mt-2 text-xl font-semibold">Управление справочником контрагентов</p>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Новый контрагент
            </Button>
          </div>
          <CounterpartiesList onEdit={handleEdit} />
        </>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div>
              {/* <h1 className="flex items-center gap-3 text-3xl font-bold">
                <Building className="h-8 w-8" />
                {mode === 'create' ? 'Создание контрагента' : 'Редактирование контрагента'}
              </h1> */}
              <p className="mt-2 text-xl font-semibold">
                {mode === 'create'
                  ? 'Заполните информацию о новом контрагенте'
                  : 'Измените информацию о контрагенте'}
              </p>
            </div>
            <Button variant="outline" onClick={handleBackToList}>
              <X className="mr-2 h-4 w-4" />
              Назад к списку
            </Button>
          </div>
          <CounterpartiesForm
            mode={mode === 'create' ? 'create' : 'edit'}
            id={editingId || undefined}
            onCancel={handleBackToList}
          />
        </>
      )}
    </div>
  );
};

export default Counterparties;
