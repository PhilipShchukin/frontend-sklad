import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import NomenclatureList from '@/components/shared/table/nomenclature/nomenclature-list';
import NomenclatureForm from '@/components/shared/table/nomenclature/nomenclature-form';

const Nomenclature: React.FC = () => {
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
              <p className="mt-2 text-xl font-semibold">Управление справочником номенклатуры</p>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Новая номенклатура
            </Button>
          </div>
          <NomenclatureList onEdit={handleEdit} />
        </>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="mt-2 text-xl font-semibold">
                {mode === 'create'
                  ? 'Заполните информацию о новой номенклатуре'
                  : 'Измените информацию о номенклатуре'}
              </p>
            </div>
            <Button variant="outline" onClick={handleBackToList}>
              <X className="mr-2 h-4 w-4" />
              Назад к списку
            </Button>
          </div>
          <NomenclatureForm
            mode={mode === 'create' ? 'create' : 'edit'}
            id={editingId || undefined}
            onCancel={handleBackToList}
          />
        </>
      )}
    </div>
  );
};

export default Nomenclature;
