import type { IProduct } from "@/types/product";

export interface ICartItem {
  product: IProduct;
  quantity: number;
}
