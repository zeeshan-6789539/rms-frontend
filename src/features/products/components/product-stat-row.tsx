import type { IProductStatRowProps } from "@/features/products/types/product-components";

export const ProductStatRow = ({ label, value }: IProductStatRowProps) => (
  <div className="space-y-1">
    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
      {label}
    </p>
    <p className="text-sm font-medium">{value}</p>
  </div>
);
