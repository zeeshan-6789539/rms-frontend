"use client";

import { createContext, useCallback, useMemo, useState } from "react";
import { CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/utils/cn";
import type {
  IToast,
  IToastContextValue,
  IToastProviderProps,
  TToastVariant,
} from "@/types/toast";

export const ToastContext = createContext<IToastContextValue | null>(null);

const TOAST_DURATION_MS = 4_000;

const variantClasses: Record<TToastVariant, string> = {
  success: "border-success/40 bg-success-soft text-success-soft-foreground",
  danger: "border-danger/40 bg-danger-soft text-danger-soft-foreground",
  info: "border-info/40 bg-info-soft text-info-soft-foreground",
};

const variantIcons: Record<TToastVariant, typeof Info> = {
  success: CheckCircle2,
  danger: TriangleAlert,
  info: Info,
};

export const ToastProvider = ({ children }: IToastProviderProps) => {
  const [toasts, setToasts] = useState<IToast[]>([]);

  const showToast = useCallback(
    (message: string, variant: TToastVariant = "success") => {
      const id = crypto.randomUUID();

      setToasts((current) => [...current, { id, message, variant }]);
      setTimeout(
        () => setToasts((current) => current.filter((toast) => toast.id !== id)),
        TOAST_DURATION_MS,
      );
    },
    [],
  );

  const value = useMemo<IToastContextValue>(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 end-4 z-[60] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
      >
        {toasts.map(({ id, message, variant }) => {
          const Icon = variantIcons[variant];

          return (
            <div
              key={id}
              role="status"
              className={cn(
                "pointer-events-auto flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm shadow-lg",
                variantClasses[variant],
              )}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
