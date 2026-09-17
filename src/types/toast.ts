import type { ReactNode } from "react";

export type TToastVariant = "success" | "danger" | "info";

export interface IToast {
  id: string;
  message: string;
  variant: TToastVariant;
}

export interface IToastContextValue {
  showToast: (message: string, variant?: TToastVariant) => void;
}

export interface IToastProviderProps {
  children: ReactNode;
}
