'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { Checkbox, type CheckboxProps } from './checkbox';
import { cn } from '../../../utils/utils.ts';

export interface CheckboxWithLabelProps
  extends Omit<CheckboxProps, 'className'> {
  /**
   * The text label displayed next to the checkbox.
   */
  label: string;

  /**
   * Additional custom CSS classes for the outer container.
   */
  className?: string;

  /**
   * Additional custom CSS classes for the checkbox component.
   */
  checkboxClassName?: string;

  /**
   * Optional link text appended to the label.
   */
  linkText?: string;

  /**
   * URL for the optional link.
   * If provided together with `linkText`, a clickable link is rendered.
   */
  linkHref?: string;

  /**
   * Additional props for the container element
   */
  containerProps?: HTMLAttributes<HTMLLabelElement>;
}

/**
 * A checkbox combined with a label and optional external link.
 *
 * Supports both controlled and uncontrolled usage patterns.
 * The entire container (label and checkbox) is clickable to toggle the checked state.
 *
 * @example
 * // Basic usage
 * <CheckboxWithLabel id="terms" label="I agree to the terms" />
 *
 * @example
 * // With link
 * <CheckboxWithLabel
 *   id="privacy"
 *   label="I agree to the"
 *   linkText="privacy policy"
 *   linkHref="/privacy"
 * />
 *
 * @example
 * // Controlled usage
 * const [checked, setChecked] = useState(false);
 * <CheckboxWithLabel
 *   id="newsletter"
 *   label="Subscribe to newsletter"
 *   checked={checked}
 *   onCheckedChange={setChecked}
 * />
 *
 * @param {CheckboxWithLabelProps} props - The props for the CheckboxWithLabel component.
 * @returns {JSX.Element} A fully interactive checkbox-with-label element.
 */
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
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors',
          className,
        )}
        {...containerProps}
      >
        <Checkbox
          ref={ref}
          id={id}
          className={checkboxClassName}
          {...checkboxProps}
        />
        <div className="text-sm text-gray-700 select-none">
          {label}
          {linkText && linkHref && (
            <a
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 ml-1"
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
