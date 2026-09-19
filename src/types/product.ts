export interface IProduct {
  id: string;
  name: string;
  sku: number;
  sellPrice: number;
  purchasePrice: number;
  quantity: number;
  remainingStock: number;
  subcategoryId: string;
  companyId: string;
  createdByUserId: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IProductPriceHistory {
  id: string;
  productId: string;
  sellPrice: number;
  purchasePrice: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  createdAt: string;
}

export interface IProductFilters {
  search?: string;
  subcategoryId?: string;
  status?: boolean;
}

export interface IProductQueryParams extends IProductFilters {
  page: number;
  limit: number;
}

export interface IProductPayload {
  name: string;
  sellPrice: number;
  purchasePrice: number;
  quantity?: number;
  subcategoryId: string;
}

export interface ISaveProductArgs {
  id?: string;
  payload: IProductPayload;
}

export interface IProductFormValues {
  name: string;
  sellPrice: string;
  purchasePrice: string;
  quantity: string;
  categoryId: string;
  subcategoryId: string;
}
