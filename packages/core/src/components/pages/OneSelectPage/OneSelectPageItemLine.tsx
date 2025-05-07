import type { ReactNode } from 'react';

import { cn } from '../../../utils/utils';
import { useOneSelectContext } from './index';

interface OneSelectionItemLineProps {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

/**
 * OneSelectionItemLine – kompakte Listendarstellung für Einzelauswahl
 */
export function OneSelectionItemLine({
  value,
  label,
  description,
  icon,
  className,
}: OneSelectionItemLineProps) {
  const { selectedValue, selectValue } = useOneSelectContext();
  const isSelected = selectedValue === value;

  return (
    <div
      onClick={() => selectValue(value)}
      className={cn(
        'w-full px-4 py-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all col-span-2',
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
