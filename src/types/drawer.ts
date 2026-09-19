import type { ReactNode } from "react";

export type TDrawerSize = "md" | "lg";

export interface IDrawerProps {
  isOpen: boolean;
  title: string;
  description?: string;
  size?: TDrawerSize;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}
