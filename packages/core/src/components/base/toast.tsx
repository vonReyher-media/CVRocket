import { animate } from '@motionone/dom';
import React, { useCallback, useEffect, useRef } from 'react';

interface ToastProps {
  message: string;
  id: string;
  onClose: (id: string) => void;
  onRemove: (id: string) => void;
  index: number;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  id,
  onClose,
  onRemove,
  visible,
}) => {
  const toastRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const animatingRef = useRef(false);

  const dismissToast = useCallback(() => {
    if (!animatingRef.current) {
      onClose(id);
    }
  }, [id, onClose]);

  useEffect(() => {
    if (toastRef.current && visible) {
      animate(
        toastRef.current,
        { opacity: [0, 1], y: [20, 0] },
        {
          duration: 0.3,
          easing: [0.22, 1, 0.36, 1],
        },
      );

      timerRef.current = setTimeout(() => {
        dismissToast();
      }, 4000);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [dismissToast, visible]);

  useEffect(() => {
    if (!visible && toastRef.current && !animatingRef.current) {
      animatingRef.current = true;

      if (timerRef.current) clearTimeout(timerRef.current);

      animate(
        toastRef.current,
        { opacity: [1, 0], y: [0, 20] },
        { duration: 0.2, easing: [0.22, 1, 0.36, 1] },
      ).finished.then(() => {
        onRemove(id);
        animatingRef.current = false;
      });
    }
  }, [visible, id, onRemove]);

  return (
    <div
      ref={toastRef}
      onClick={dismissToast}
      className="pointer-events-auto flex items-center gap-3 rounded-lg bg-background px-4 py-3 shadow-lg border border-muted w-full max-w-md"
      role="alert"
      aria-live="polite"
    >
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          dismissToast();
        }}
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus:outline-none"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-x"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
};
