import type { IProduct } from "@/types/product";

export interface IProductsTableProps {
  products: readonly IProduct[];
  categoryLabelBySubcategoryId: Map<string, string>;
  onEdit: (product: IProduct) => void;
  onToggleStatus: (product: IProduct) => void;
}

export interface IProductFormDialogProps {
  isOpen: boolean;
  product: IProduct | null;
  onClose: () => void;
}

export interface IProductDetailViewProps {
  productId: string;
}

export interface IProductStatRowProps {
  label: string;
  value: string;
}
