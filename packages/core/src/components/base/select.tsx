// base/select.tsx
import * as React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  className?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="text-sm font-medium text-foreground">{label}</label>
        )}
        <select
          ref={ref}
          className={`flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background
            placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? 'border-destructive focus-visible:ring-destructive' : 'border-input'} ${className}`}
          {...props}
        >
          <option value="" disabled hidden>
            Bitte wählen
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  },
);
Select.displayName = 'Select';
