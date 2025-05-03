import { FieldErrors, useFormContext } from 'react-hook-form';
import { Slider } from '../../base/slider.tsx';

interface UniversalSliderFieldProps {
  name: string;
  label?: string;
  min: number;
  max: number;
  step?: number;
  className?: string;
}

/**
 * UniversalSliderField – numeric range slider with zod-integration.
 */
export function UniversalSliderField({
  name,
  label,
  min,
  max,
  step,
  className,
}: UniversalSliderFieldProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(name);
  const error = (errors as FieldErrors)?.[name]?.message as string | undefined;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <Slider
        min={min}
        max={max}
        step={step}
        value={value ?? min}
        onChange={(val) => setValue(name, val, { shouldValidate: true })}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
