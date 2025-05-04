// UniversalSelectField.tsx
import { FieldErrors, useFormContext } from 'react-hook-form';

import { Select } from '../../base/select.tsx';

interface UniversalSelectFieldProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  className?: string;
}

export function UniversalSelectField({
  name,
  label,
  options,
  className,
}: UniversalSelectFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = (errors as FieldErrors)?.[name]?.message as string | undefined;

  return (
    <Select
      label={label}
      error={error}
      className={className}
      {...register(name)}
      options={options}
    />
  );
}
