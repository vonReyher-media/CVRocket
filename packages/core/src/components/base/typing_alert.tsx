import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/utils';
import { animate, stagger } from '@motionone/dom';

export interface TypingTextProps {
  text: string;
  icon?: ReactNode;
  className?: string;
  speed?: number;
  delay?: number;
  iconClassName?: string;
}

export function TypingText({
  text,
  icon: Icon,
  className,
  speed = 0.02,
  delay = 0.1,
  iconClassName,
}: TypingTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const [displayText, setDisplayText] = useState(text);

  // Update display text when text prop changes
  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  // Run animation when text changes
  useEffect(() => {
    if (!containerRef.current) return;

    // Get all character spans
    const chars = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>('.char'),
    );

    // Reset all characters to hidden
    chars.forEach((char) => {
      char.style.opacity = '0';
      char.style.transform = 'translateY(10px)';
    });

    // Animate icon if present
    if (iconRef.current) {
      iconRef.current.style.opacity = '0';
      iconRef.current.style.transform = 'scale(0)';

      animate(
        iconRef.current,
        { opacity: [0, 1], scale: [0, 1] },
        { duration: 0.3, delay },
      );
    }

    // Animate characters one by one
    animate(
      chars,
      { opacity: [0, 1], y: ['10px', '0px'] },
      {
        delay: stagger(speed, { start: delay }),
        duration: 0.2,
        easing: 'ease-out',
      },
    );
  }, [displayText, speed, delay]);

  return (
    <div
      className={cn(
        'w-full rounded-lg border bg-primary/5 p-4',
        'border-primary/50',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <span
            ref={iconRef}
            className={cn(
              'opacity-0 rounded-full bg-primary/10 p-2',
              'text-primary',
              iconClassName,
            )}
          >
            {Icon}
          </span>
        )}
        <span ref={containerRef} className="flex-1">
          {displayText.split('').map((char, index) => (
            <span
              key={`${index}-${char}`}
              className={cn(
                'char inline-block opacity-0',
                'text-card-foreground',
                'font-medium',
              )}
              style={{ transform: 'translateY(10px)' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
