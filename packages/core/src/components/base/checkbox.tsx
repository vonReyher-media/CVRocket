'use client';

import { Check } from 'lucide-react';
import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { cn } from '../../../utils/utils.ts';

export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'checked' | 'defaultChecked' | 'onChange'
  > {
  /** Unique ID for the checkbox input */
  id: string;
  /** Controlled checked state */
  checked?: boolean;
  /** Uncontrolled default checked state */
  defaultChecked?: boolean;
  /** Callback when the checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Additional custom CSS classes */
  className?: string;
}

/**
 * Checkbox component that supports both controlled and uncontrolled usage.
 *
 * @example
 * // Controlled usage
 * const [checked, setChecked] = useState(false);
 * <Checkbox id="terms" checked={checked} onCheckedChange={setChecked} />
 *
 * @example
 * // Uncontrolled usage
 * <Checkbox id="terms" defaultChecked={true} />
 *
 * @param {CheckboxProps} props - The props for the Checkbox component.
 * @returns {JSX.Element} A checkbox that works in controlled or uncontrolled mode.
 */
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
          className="absolute opacity-0 w-0 h-0"
        />
        <label
          htmlFor={id}
          className={cn(
            'flex h-5 w-5 cursor-pointer items-center justify-center rounded border transition-colors',
            currentChecked ? 'border-primary bg-primary' : 'border-gray-300',
          )}
        >
          {currentChecked && <Check className="h-4 w-4 text-white" />}
        </label>
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
