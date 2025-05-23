import type { ReactNode } from 'react';

import { cn } from '../../../utils/utils';
import { useMultiSelectContext } from './index';

interface MultiSelectionItemLineProps {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

/**
 * MultiSelectionItemLine – horizontale Listendarstellung für Mehrfachauswahl
 */
export function MultiSelectionItemLine({
  value,
  label,
  description,
  icon,
  className,
}: MultiSelectionItemLineProps) {
  const { selectedValues, toggleSelection } = useMultiSelectContext();
  const isSelected = selectedValues.has(value);

  return (
    <div
      onClick={() => toggleSelection(value)}
      className={cn(
        'col-span-2 w-full px-4 py-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all',
        'hover:border-primary/50 hover:shadow-sm',
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border bg-background',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {icon && <div className="text-primary">{icon}</div>}
        <div>
          <h4 className="text-sm font-medium text-foreground">{label}</h4>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      <div
        className={cn(
          'w-5 h-5 rounded-full border-2 flex items-center justify-center',
          isSelected ? 'border-primary bg-primary/10' : 'border-muted',
        )}
      >
        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
      </div>
    </div>
  );
}
