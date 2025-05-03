import * as React from 'react';

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
  }
>(({ className, type, label, error, ...props }, ref) => {
  return (
    <div className="w-full space-y-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        type={type}
        className={
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ' +
          className
        }
        ref={ref}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';

export { Input };
