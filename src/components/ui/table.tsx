import { cn } from "@/utils/cn";
import type {
  ITableCellProps,
  ITableHeaderCellProps,
  ITableProps,
  ITableRowProps,
  ITableSectionProps,
} from "@/types/table";

export const Table = ({ children, className }: ITableProps) => (
  <div
    className={cn(
      "w-full max-h-[80vh] overflow-auto rounded-card border border-border bg-card shadow-md",
      className,
    )}
  >
    <table className="w-full min-w-3xl border-collapse text-sm">{children}</table>
  </div>
);

export const TableHead = ({ children, className, ...props }: ITableSectionProps) => (
  <thead className={cn("sticky top-0 z-10 bg-card-muted", className)} {...props}>
    {children}
  </thead>
);

export const TableBody = ({ children, className, ...props }: ITableSectionProps) => (
  <tbody className={cn("divide-y divide-border", className)} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className, ...props }: ITableRowProps) => (
  <tr className={cn("transition-colors hover:bg-muted/60", className)} {...props}>
    {children}
  </tr>
);

export const TableHeaderCell = ({
  children,
  className,
  ...props
}: ITableHeaderCellProps) => (
  <th
    scope="col"
    className={cn(
      "px-4 py-3 text-start text-xs font-semibold tracking-wide text-muted-foreground uppercase",
      className,
    )}
    {...props}
  >
    {children}
  </th>
);

export const TableCell = ({ children, className, ...props }: ITableCellProps) => (
  <td className={cn("px-4 py-3 align-middle", className)} {...props}>
    {children}
  </td>
);
