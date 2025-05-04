// UniversalInputField.tsx
import { FieldErrors, useFormContext } from 'react-hook-form';

import { Input } from '../../base/input.tsx';

interface UniversalInputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
}

export function UniversalInputField({
  name,
  label,
  type = 'text',
  placeholder,
  className,
}: UniversalInputFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = (errors as FieldErrors)?.[name]?.message as string | undefined;

  return (
    <Input
      type={type}
      label={label}
      placeholder={placeholder}
      error={error}
      className={className}
      {...register(name)}
    />
  );
}
