import { apiClient } from "@/lib/api-client";
import { buildQueryParams } from "@/utils/query-params";
import type { IPaginatedResult } from "@/types/api";
import type {
  IProduct,
  IProductPayload,
  IProductPriceHistory,
  IProductQueryParams,
} from "@/types/product";

const PRODUCTS_PATH = "/products";

export const fetchProducts = async (
  params: IProductQueryParams,
): Promise<IPaginatedResult<IProduct>> => {
  const { data } = await apiClient.get<IPaginatedResult<IProduct>>(PRODUCTS_PATH, {
    params: buildQueryParams({ ...params }),
  });

  return data;
};

export const fetchProduct = async (id: string): Promise<IProduct> => {
  const { data } = await apiClient.get<IProduct>(`${PRODUCTS_PATH}/${id}`);
  return data;
};

export const fetchProductPriceHistory = async (
  id: string,
): Promise<IProductPriceHistory[]> => {
  const { data } = await apiClient.get<IProductPriceHistory[]>(
    `${PRODUCTS_PATH}/${id}/price-history`,
  );

  return data;
};

export const createProduct = async (payload: IProductPayload): Promise<IProduct> => {
  const { data } = await apiClient.post<IProduct>(PRODUCTS_PATH, payload);
  return data;
};

export const updateProduct = async (
  id: string,
  payload: IProductPayload,
): Promise<IProduct> => {
  const { data } = await apiClient.patch<IProduct>(`${PRODUCTS_PATH}/${id}`, payload);
  return data;
};

// DELETE deactivates — the row is kept for audit purposes
export const deactivateProduct = async (id: string): Promise<IProduct> => {
  const { data } = await apiClient.delete<IProduct>(`${PRODUCTS_PATH}/${id}`);
  return data;
};

export const restoreProduct = async (id: string): Promise<IProduct> => {
  const { data } = await apiClient.patch<IProduct>(`${PRODUCTS_PATH}/${id}/restore`);
  return data;
};
