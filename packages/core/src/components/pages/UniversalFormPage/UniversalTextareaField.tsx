// UniversalTextareaField.tsx
import { FieldErrors, useFormContext } from 'react-hook-form';
import { Textarea } from '../../base/textarea.tsx';

interface UniversalTextareaFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function UniversalTextareaField({
  name,
  label,
  placeholder,
  rows = 3,
  className,
}: UniversalTextareaFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = (errors as FieldErrors)?.[name]?.message as string | undefined;

  return (
    <Textarea
      label={label}
      rows={rows}
      placeholder={placeholder}
      error={error}
      className={className}
      {...register(name)}
    />
  );
}
