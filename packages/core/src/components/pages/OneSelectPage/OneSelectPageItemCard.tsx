import type { ReactNode } from 'react';

import { cn } from '../../../utils/utils';
import { useOneSelectContext } from './index';
import { TypingTextProps } from 'src/components/base/typing_alert';

interface OneSelectionItemCardProps {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  imageUrl?: string;
  className?: string;
  animated_description_text?: TypingTextProps;
}

/**
 * OneSelectionItemCard – visuelle Karte für Einzelauswahl mit optionalem Bild/Icon
 */
export function OneSelectionItemCard({
  value,
  label,
  description,
  icon,
  imageUrl,
  className,
  animated_description_text,
}: OneSelectionItemCardProps) {
  const { selectedValue, selectValue } = useOneSelectContext();
  const isSelected = selectedValue === value;

  return (
    <div
      onClick={() => selectValue(value)}
      className={cn(
        'group relative flex flex-col justify-between h-full rounded-xl border bg-background p-4 transition-all cursor-pointer',
        'hover:shadow-md hover:border-primary/60',
        isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border',
        className,
      )}
    >
      {imageUrl && (
        <div className="relative w-full h-32 overflow-hidden rounded-md mb-4">
          <img
            src={imageUrl}
            alt={label}
            className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform"
          />
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-start gap-3">
          {icon && <div className="text-primary text-xl mt-0.5">{icon}</div>}
          <div className="flex-1">
            <h3 className="font-medium text-foreground text-base leading-tight">
              {label}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground leading-snug">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div
          aria-hidden="true"
          data-selected={isSelected}
          className={cn(
            'w-5 h-5 rounded-full border-2 flex items-center justify-center',
            isSelected ? 'border-primary bg-primary/10' : 'border-muted',
          )}
        >
          {isSelected && (
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          )}
        </div>
      </div>
    </div>
  );
}
