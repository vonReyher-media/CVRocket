import * as React from 'react';

export interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

/**
 * Slider – a custom range input that emits numbers.
 */
export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ min, max, step = 1, value, onChange, className, ...props }, ref) => {
    return (
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={
          'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ' +
          '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary ' +
          '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none ' +
          className
        }
        ref={ref}
        {...props}
      />
    );
  },
);

Slider.displayName = 'Slider';
