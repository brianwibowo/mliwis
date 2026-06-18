'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

// ============================================================
// Toast Types
// ============================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, type: ToastType) => string;
  removeToast: (id: string) => void;
}

// ============================================================
// Context
// ============================================================

export const ToastContext = createContext<ToastContextValue | null>(null);

// ============================================================
// Provider
// ============================================================

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = `toast-${++nextId}-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    return id;
  }, []);

  // Auto-dismiss setelah 5 detik
  useEffect(() => {
    if (toasts.length === 0) return;

    const latestToast = toasts[toasts.length - 1];
    const timer = setTimeout(() => {
      removeToast(latestToast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toasts, removeToast]);

  const value: ToastContextValue = { toasts, addToast, removeToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => {
          let Icon = Info;
          if (toast.type === 'success') Icon = CheckCircle2;
          else if (toast.type === 'error') Icon = AlertCircle;
          else if (toast.type === 'warning') Icon = AlertTriangle;

          return (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              <div className="toast-icon">
                <Icon size={18} />
              </div>
              <div className="toast-content">
                <p className="toast-message">{toast.message}</p>
              </div>
              <button
                type="button"
                className="toast-close"
                onClick={() => removeToast(toast.id)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast harus digunakan di dalam <ToastProvider>');
  }
  return ctx;
}

