'use client';

import { useEffect } from 'react';

import type React from 'react';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';
import { Toast } from '../components/base/toast.tsx';

type ToastType = {
  id: string;
  message: string;
  createdAt: number;
  visible: boolean; // Track visibility state for animation
};

interface ToastContextType {
  toasts: ToastType[];
  showToast: (message: string) => void;
  hideToast: (id: string) => void;
  removeToast: (id: string) => void; // New method to actually remove from DOM
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Maximum number of visible toasts
const MAX_TOASTS = 5;

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const toastQueueRef = useRef<ToastType[]>([]);
  const processingRef = useRef(false);

  // Process the toast queue
  const processQueue = useCallback(() => {
    if (processingRef.current || toastQueueRef.current.length === 0) {
      return;
    }

    processingRef.current = true;

    // Get the next toast from the queue
    const nextToast = toastQueueRef.current.shift();
    if (nextToast) {
      setToasts((prev) => {
        // Only remove oldest toasts if we exceed the maximum
        if (prev.length >= MAX_TOASTS) {
          return [...prev.slice(1), nextToast];
        }
        return [...prev, nextToast];
      });

      // Process the next toast after a delay
      setTimeout(() => {
        processingRef.current = false;
        processQueue();
      }, 150); // Stagger delay between toasts
    }
  }, []);

  const showToast = useCallback(
    (message: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = { id, message, createdAt: Date.now(), visible: true };

      // Add to queue
      toastQueueRef.current.push(newToast);

      // Start processing if not already
      processQueue();
    },
    [processQueue],
  );

  // First step: mark toast as hidden to trigger animation
  const hideToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, visible: false } : toast,
      ),
    );
  }, []);

  // Second step: actually remove toast from DOM after animation
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Handle click outside to dismiss all toasts
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      // Check if the click is outside any toast
      if (!target.closest('[role="alert"]') && !target.closest('button')) {
        // Dismiss all toasts with a staggered delay
        toasts.forEach((toast, index) => {
          setTimeout(() => {
            hideToast(toast.id);
          }, index * 50);
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [toasts, hideToast]);

  return (
    <ToastContext.Provider
      value={{ toasts, showToast, hideToast, removeToast }}
    >
      {children}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col-reverse items-center pointer-events-none p-4 gap-3">
        {toasts.map((toast, index) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            onClose={hideToast}
            onRemove={removeToast}
            index={index}
            visible={toast.visible}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const CheckAvailableToastProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const context = useContext(ToastContext);

  if (context !== undefined) {
    return <>{children}</>;
  }

  return <ToastProvider>{children}</ToastProvider>;
};
