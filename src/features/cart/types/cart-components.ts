import type { ICartItem } from "@/types/cart";
import type { IProduct } from "@/types/product";

export interface ICartCatalogProps {
  products: readonly IProduct[];
  cartQuantityById: Map<string, number>;
  categoryLabelBySubcategoryId: Map<string, string>;
  onAdd: (product: IProduct) => void;
}

export interface ICartLinesProps {
  items: readonly ICartItem[];
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}
