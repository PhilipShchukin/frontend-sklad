import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, X, Search, AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAgentSearchList } from '@/hooks/use-shipment';
import type { AgentList } from '@/services/shipment.service';

interface AgentSelectorProps {
  selectedAgents: AgentList[];
  onAgentToggle: (agent: AgentList) => void;
  onRemoveAgent: (agentId: number) => void;
  placeholder?: string;
  className?: string;
  maxSelections?: number;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  selectedAgents,
  onAgentToggle,
  onRemoveAgent,
  placeholder = 'Начните вводить имя контрагента...',
  className = '',
  maxSelections,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const { filteredAgents, setSearchTerm, isLoading, error } = useAgentSearchList();
  console.log('filteredAgents', filteredAgents);

  // Дебаунс поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, setSearchTerm]);

  // Фокус на инпут при открытии
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setLocalSearch('');
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setSearchTerm]);

  const handleAgentSelect = useCallback(
    (agent: AgentList) => {
      onAgentToggle(agent);
      setLocalSearch('');
      setSearchTerm('');
      setIsOpen(false);
    },
    [onAgentToggle, setSearchTerm],
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        setLocalSearch('');
        setSearchTerm('');
      }
    },
    [setSearchTerm],
  );

  return (
    <div className={`space-y-2 ${className}`} ref={searchRef}>
      {/* Поле ввода для поиска и отображения выбранных */}
      <div className="relative">
        <div
          className="border-input bg-background ring-offset-background focus-within:ring-ring flex min-h-[40px] cursor-pointer flex-wrap items-center gap-2 rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2"
          onClick={() => setIsOpen(true)}
        >
          {selectedAgents.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            selectedAgents.map((agent) => (
              <Badge key={agent.id} variant="secondary" className="flex items-center gap-1">
                {agent.name}
                <button
                  type="button"
                  className="hover:text-destructive ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveAgent(agent.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
        <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
      </div>

      {/* Поповер с поиском и списком */}
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <div className="hidden" />
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start" sideOffset={5}>
          <div className="p-2">
            {/* Поле поиска внутри поповера */}
            <div className="relative mb-2">
              <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                ref={inputRef}
                placeholder="Поиск по имени, УНП, GLN..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-8"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Ограничение выбора */}
            {maxSelections && selectedAgents.length >= maxSelections && (
              <Alert className="mb-2 py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Достигнуто максимальное количество выбранных контрагентов ({maxSelections})
                </AlertDescription>
              </Alert>
            )}

            {/* Список агентов */}
            <div className="max-h-[300px] overflow-y-auto">
              {error ? (
                <Alert variant="destructive" className="my-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Ошибка загрузки контрагентов
                  </AlertDescription>
                </Alert>
              ) : isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="animate-spin" size={18} />
                </div>
              ) : filteredAgents.length === 0 ? (
                <div className="text-muted-foreground p-4 text-center text-sm">
                  {localSearch ? 'Контрагент не найден' : 'Нет доступных контрагентов'}
                </div>
              ) : (
                filteredAgents.map((agent) => {
                  const isSelected = selectedAgents.some((a) => a.id === agent.id);
                  const isDisabled =
                    maxSelections && selectedAgents.length >= maxSelections && !isSelected;

                  return (
                    <div
                      key={agent.id}
                      className={`flex cursor-pointer items-center justify-between rounded-md p-3 ${
                        isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-muted'
                      }`}
                      onClick={() => !isDisabled && handleAgentSelect(agent)}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-muted-foreground text-xs">
                          УНП: {agent.unp} • GLN: {agent.gln}
                          {agent.country && ` • ${agent.country.name}`}
                        </div>
                        {agent.address && (
                          <div className="text-muted-foreground truncate text-xs">
                            {agent.address}
                          </div>
                        )}
                      </div>
                      <Checkbox
                        checked={isSelected}
                        // disabled={isDisabled}
                        className="ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isDisabled) {
                            onAgentToggle(agent);
                          }
                        }}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Подпись с ID выбранных агентов */}
      {selectedAgents.length > 0 && (
        <div className="text-muted-foreground space-y-1 text-xs">
          <div>Выбрано контрагентов: {selectedAgents.length}</div>
          <div className="font-mono text-[10px]">
            ID: {selectedAgents.map((a) => a.id).join(', ')}
          </div>
          {selectedAgents.map((agent) => (
            <div key={agent.id} className="mt-1">
              <span className="font-medium">{agent.name}</span>
              {agent.unp && <span className="ml-2">УНП: {agent.unp}</span>}
              {agent.gln && <span className="ml-2">GLN: {agent.gln}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
