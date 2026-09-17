"use client";

import { useContext } from "react";
import { ToastContext } from "@/components/providers/toast-provider";
import type { IToastContextValue } from "@/types/toast";

export const useToast = (): IToastContextValue => {
  const context = useContext(ToastContext);

  if (!context) throw new Error("useToast must be used inside a ToastProvider");

  return context;
};
