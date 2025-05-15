'use client';

import { type FieldErrors, useFormContext } from 'react-hook-form';
import { Slider } from '../../base/slider.tsx';
import { useEffect } from 'react';

interface UniversalSliderFieldProps {
  name: string;
  label?: string;
  description?: string;
  min: number;
  max: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  showValue?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  className?: string;
}

/**
 * UniversalSliderField – numeric range slider with zod-integration.
 *
 * Features:
 * - Integrates with react-hook-form
 * - Displays min/max labels
 * - Shows current value
 * - Supports custom step sizes
 * - Displays validation errors
 */
export function UniversalSliderField({
  name,
  label,
  description,
  min,
  max,
  step = 1,
  minLabel,
  maxLabel,
  showValue = true,
  valuePrefix = '',
  valueSuffix = '',
  className,
}: UniversalSliderFieldProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(name) ?? min;

  useEffect(() => {
    if (value === min) {
      setValue(name, min, { shouldValidate: true });
    }
  }, [name, min, value, setValue]);

  const error = (errors as FieldErrors)?.[name]?.message as string | undefined;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        {label && <label className="text-sm font-medium">{label}</label>}
        {showValue && (
          <span className="text-sm font-medium bg-muted px-2 py-1 rounded-md">
            {valuePrefix}
            {value}
            {valueSuffix}
          </span>
        )}
      </div>

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <div className="pt-2">
        <Slider
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(val) => setValue(name, val, { shouldValidate: true })}
        />

        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>{minLabel || min}</span>
          <span>{maxLabel || max}</span>
        </div>
      </div>

      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}

export default UniversalSliderField;
