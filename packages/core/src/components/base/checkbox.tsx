'use client';

import { cva } from 'class-variance-authority';
import { Check } from 'lucide-react';
import { forwardRef, type InputHTMLAttributes, useState } from 'react';

import { cn } from '../../../utils/utils.ts';

export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'checked' | 'defaultChecked' | 'onChange'
  > {
  id: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

const checkboxVariants = cva(
  'flex h-5 w-5 cursor-pointer items-center justify-center rounded border transition-colors',
  {
    variants: {
      checked: {
        true: 'bg-primary border-primary text-primary-foreground',
        false: 'bg-background border-muted',
      },
    },
    defaultVariants: {
      checked: false,
    },
  },
);

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { id, checked, defaultChecked, onCheckedChange, className = '', ...props },
    ref,
  ) => {
    const [internalChecked, setInternalChecked] = useState(
      defaultChecked ?? false,
    );

    const isControlled = checked !== undefined;
    const currentChecked = isControlled ? checked : internalChecked;

    const handleChange = (newChecked: boolean) => {
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      onCheckedChange?.(newChecked);
    };

    return (
      <div className={cn('relative', className)}>
        <input
          {...props}
          ref={ref}
          type="checkbox"
          id={id}
          checked={currentChecked}
          onChange={(e) => handleChange(e.target.checked)}
          className="peer sr-only"
        />
        <label
          htmlFor={id}
          className={cn(checkboxVariants({ checked: currentChecked }))}
        >
          {currentChecked && <Check className="h-4 w-4" />}
        </label>
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
