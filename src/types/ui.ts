import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

export type TButtonVariant =
  | "primary"
  | "secondary"
  | "soft"
  | "outline"
  | "ghost"
  | "danger";

export type TButtonSize = "sm" | "md" | "icon";

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TButtonVariant;
  size?: TButtonSize;
  isLoading?: boolean;
}

export interface ICardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  trailing?: ReactNode;
}

export interface ITextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export interface ISelectOption {
  value: string;
  label: string;
}

export interface ISelectProps {
  id?: string;
  options: readonly ISelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export interface IFormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export type TAlertVariant = "danger" | "info" | "success";

export interface IAlertProps {
  variant?: TAlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

export type TBadgeVariant = "success" | "danger" | "info" | "warning" | "muted";

export interface IBadgeProps {
  variant?: TBadgeVariant;
  children: ReactNode;
  className?: string;
}

export interface IEmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export interface ISearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  className?: string;
}

export interface IStatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
}
