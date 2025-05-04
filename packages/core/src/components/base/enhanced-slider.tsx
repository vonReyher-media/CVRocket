import { animate } from '@motionone/dom';
import React, { useEffect, useRef, useState } from 'react';

export interface EnhancedSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  onDrag?: (value: number) => void;
  className?: string;
  debounceChangeMs?: number;
}

/**
 * EnhancedSlider – A modern, accessible slider component with live feedback and animation.
 */
export const EnhancedSlider = React.forwardRef<
  HTMLInputElement,
  EnhancedSliderProps
>(
  (
    {
      min,
      max,
      step = 1,
      value,
      onChange,
      onDrag,
      className,
      debounceChangeMs = 0,
      ...props
    },
    ref,
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const sliderRef = useRef<HTMLInputElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const combinedRef = useCombinedRefs(ref, sliderRef);
    const debounceTimeout = useRef<ReturnType<typeof setTimeout>>();

    // Sync with controlled value
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const percentage = ((localValue - min) / (max - min)) * 100;

    const triggerChange = React.useCallback(
      (val: number) => {
        if (val === value) return;
        if (debounceChangeMs > 0) {
          clearTimeout(debounceTimeout.current);
          debounceTimeout.current = setTimeout(() => {
            onChange(val);
          }, debounceChangeMs);
        } else {
          onChange(val);
        }
      },
      [value, debounceChangeMs, onChange],
    );

    // Mobile touch events
    useEffect(() => {
      const slider = sliderRef.current;
      if (!slider) return;

      const handleTouchStart = () => setIsDragging(true);
      const handleTouchEnd = () => {
        setIsDragging(false);
        triggerChange(localValue);
      };

      slider.addEventListener('touchstart', handleTouchStart);
      slider.addEventListener('touchend', handleTouchEnd);

      return () => {
        slider.removeEventListener('touchstart', handleTouchStart);
        slider.removeEventListener('touchend', handleTouchEnd);
      };
    }, [localValue, triggerChange]);

    // Animate thumb on drag
    useEffect(() => {
      if (!thumbRef.current) return;

      animate(
        thumbRef.current,
        isDragging
          ? { scale: 1.2, boxShadow: '0 0 0 8px rgba(var(--primary), 0.1)' }
          : { scale: 1, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' },
        { duration: 0.2, easing: [0.16, 1, 0.3, 1] },
      );
    }, [isDragging]);

    // Animate thumb position
    useEffect(() => {
      if (!thumbRef.current) return;

      animate(
        thumbRef.current,
        { left: `calc(${percentage}% - 12px)` },
        { duration: 0.2, easing: [0.16, 1, 0.3, 1] },
      );
    }, [percentage]);

    // Local input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVal = Number(e.target.value);
      setLocalValue(newVal);

      if (onDrag) onDrag(newVal);
      triggerChange(newVal);
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => {
      setIsDragging(false);
      triggerChange(localValue);
    };

    return (
      <div className="relative py-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleInputChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={localValue}
          className={`
            w-full h-2 bg-transparent appearance-none relative z-10
            cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
            [&::-webkit-slider-runnable-track]:appearance-none
            [&::-webkit-slider-runnable-track]:bg-transparent
            [&::-webkit-slider-runnable-track]:h-2
            [&::-webkit-slider-runnable-track]:rounded-full

            [&::-moz-range-track]:appearance-none
            [&::-moz-range-track]:bg-transparent
            [&::-moz-range-track]:h-2
            [&::-moz-range-track]:rounded-full

            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:bg-transparent
            [&::-webkit-slider-thumb]:border-none
            [&::-webkit-slider-thumb]:mt-[-8px]

            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:w-6
            [&::-moz-range-thumb]:h-6
            [&::-moz-range-thumb]:bg-transparent
            [&::-moz-range-thumb]:border-none

            ${className ?? ''}
          `}
          ref={combinedRef}
          {...props}
        />

        {/* Visual track */}
        <div className="absolute top-[18px] left-0 right-0 h-2 bg-gray-200 rounded-full pointer-events-none">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Visual thumb */}
        <div
          ref={thumbRef}
          className="absolute top-[10px] w-6 h-6 rounded-full bg-primary border-4 border-white shadow-md pointer-events-none"
          style={{
            left: `calc(${percentage}% - 12px)`,
            transform: isDragging ? 'scale(1.2)' : 'scale(1)',
            boxShadow: isDragging
              ? '0 0 0 8px rgba(var(--primary), 0.1)'
              : '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
        />
      </div>
    );
  },
);

EnhancedSlider.displayName = 'EnhancedSlider';

function useCombinedRefs<T>(...refs: React.Ref<T>[]) {
  const targetRef = React.useRef<T>(null);

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        (ref as React.MutableRefObject<T | null>).current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}
