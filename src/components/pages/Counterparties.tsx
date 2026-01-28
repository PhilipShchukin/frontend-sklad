import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import CounterpartiesList from '@/components/shared/table/counterparties/counterparties-list';
import CounterpartiesForm from '@/components/shared/table/counterparties/counterparties-form';

const Counterparties: React.FC = () => {
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreate = () => {
    setMode('create');
    setEditingId(null);
  };

  const handleEdit = (id: string) => {
    setMode('edit');
    setEditingId(id);
  };

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
