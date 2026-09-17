import type {
  HTMLAttributes,
  ReactNode,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

export interface ITableProps {
  children: ReactNode;
  className?: string;
}

export interface ITableSectionProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export interface ITableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

export interface ITableHeaderCellProps
  extends ThHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
}

export interface ITableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
}
