import { cva } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../utils/utils.ts';
import { Checkbox, type CheckboxProps } from './checkbox';

export interface CheckboxWithLabelProps
  extends Omit<CheckboxProps, 'className'> {
  label: string;
  className?: string;
  checkboxClassName?: string;
  linkText?: string;
  linkHref?: string;
  containerProps?: HTMLAttributes<HTMLLabelElement>;
}

// Optional: eigene Checkbox-Variants, falls du unterschiedliche Varianten möchtest
const checkboxWithLabelVariants = cva(
  'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
  {
    variants: {
      variant: {
        default: 'border-border hover:bg-muted bg-background text-foreground',
        outline:
          'border-muted-foreground hover:bg-accent bg-background text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const CheckboxWithLabel = forwardRef<
  HTMLInputElement,
  CheckboxWithLabelProps
>(
  (
    {
      id,
      label,
      className = '',
      checkboxClassName = '',
      linkText,
      linkHref,
      containerProps = {},
      ...checkboxProps
    },
    ref,
  ) => {
    return (
      <label
        htmlFor={id}
        className={cn(checkboxWithLabelVariants(), className)}
        {...containerProps}
      >
        <Checkbox
          ref={ref}
          id={id}
          className={checkboxClassName}
          {...checkboxProps}
        />
        <div className="text-sm text-muted-foreground select-none">
          {label}
          {linkText && linkHref && (
            <a
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 ml-1 underline underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {linkText}
            </a>
          )}
        </div>
      </label>
    );
  },
);

CheckboxWithLabel.displayName = 'CheckboxWithLabel';
