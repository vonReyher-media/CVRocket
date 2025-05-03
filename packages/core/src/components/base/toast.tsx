import React, { useCallback } from 'react';

import { animate } from '@motionone/dom';
import { useEffect, useRef } from 'react';

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
  const timerRef = useRef<number>();
  const animatingRef = useRef(false);

  const dismissToast = useCallback(() => {
    if (!animatingRef.current) {
      onClose(id);
    }
  }, [id, onClose]);

  // Handle mount animation
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

      // Auto-dismiss after 4 seconds
      timerRef.current = setTimeout(() => {
        dismissToast();
      }, 4000);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [dismissToast, toastRef, visible]);

  // Handle unmount animation when visible changes to false
  useEffect(() => {
    if (!visible && toastRef.current && !animatingRef.current) {
      animatingRef.current = true;

      // Clear the timeout to prevent double-dismissal
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      animate(
        toastRef.current,
        { opacity: [1, 0], y: [0, 20] },
        { duration: 0.2, easing: [0.22, 1, 0.36, 1] },
      ).finished.then(() => {
        // Only remove from DOM after animation completes
        onRemove(id);
        animatingRef.current = false;
      });
    }
  }, [visible, id, onRemove]);

  return (
    <div
      ref={toastRef}
      onClick={() => dismissToast()}
      className="pointer-events-auto flex items-center gap-3 rounded-lg bg-white dark:bg-gray-800 px-4 py-3 shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-md"
      role="alert"
      aria-live="polite"
    >
      <div className="flex-1">
        <p className="text-sm text-gray-800 dark:text-gray-200">{message}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          dismissToast();
        }}
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
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
