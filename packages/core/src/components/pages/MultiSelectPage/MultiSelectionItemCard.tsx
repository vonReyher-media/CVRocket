'use client';

import { cn } from '../../../../utils/utils';
import { useMultiSelectContext } from './index';
import { Check } from 'lucide-react';
import type { ReactNode } from 'react';

interface MultiSelectionItemCardProps {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  /**
   * Either provide an imageUrl OR an imageComponent
   */
  imageUrl?: string;
  /**
   * Custom image component (e.g., Next.js Image)
   */
  imageComponent?: ReactNode;
  className?: string;
}

/**
 * MultiSelectionItemCard – modern card with optional icon or image
 */
export function MultiSelectionItemCard({
  value,
  label,
  description,
  icon,
  imageUrl,
  imageComponent,
  className,
}: MultiSelectionItemCardProps) {
  const { selectedValues, toggleSelection } = useMultiSelectContext();
  const isSelected = selectedValues.has(value);

  return (
    <div
      onClick={() => toggleSelection(value)}
      className={cn(
        'col-span-1 group relative flex flex-col h-full rounded-xl border bg-background p-4 transition-all cursor-pointer overflow-hidden',
        'hover:shadow-md hover:border-primary/60',
        isSelected
          ? 'border-primary ring-1 ring-primary/30 shadow-sm bg-primary/5'
          : 'border-border hover:translate-y-[-2px]',
        className,
      )}
    >
      {/* Selected indicator - subtle top border */}
      {isSelected && (
        <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
      )}

      {/* Image section - either custom component or regular img */}
      {(imageUrl || imageComponent) && (
        <div className="relative w-full h-32 overflow-hidden rounded-md mb-4">
          {imageComponent ? (
            // Render the custom image component
            <div
              className={cn(
                'w-full h-full transition-all duration-300',
                'group-hover:scale-[1.03]',
                isSelected ? 'saturate-[1.1] brightness-[1.02]' : '',
              )}
            >
              {imageComponent}
            </div>
          ) : imageUrl ? (
            // Render regular img with imageUrl
            <img
              src={imageUrl || '/placeholder.svg'}
              alt={label}
              className={cn(
                'object-cover w-full h-full transition-all duration-300',
                'group-hover:scale-[1.03]',
                isSelected ? 'saturate-[1.1] brightness-[1.02]' : '',
              )}
            />
          ) : null}
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-start gap-3">
          {icon && (
            <div
              className={cn(
                'text-xl mt-0.5 transition-colors',
                isSelected
                  ? 'text-primary'
                  : 'text-muted-foreground group-hover:text-primary/80',
              )}
            >
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h3
              className={cn(
                'font-medium text-base leading-tight transition-colors',
                isSelected ? 'text-primary' : 'text-foreground',
              )}
            >
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

      {/* Selected check mark - appears in top right when selected */}
      {isSelected && (
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm">
          <Check size={16} />
        </div>
      )}
    </div>
  );
}
