import { apiClient } from "@/lib/api-client";
import type {
  ICategory,
  ICategoryPayload,
  ICategoryTree,
  ISubcategory,
  ISubcategoryPayload,
} from "@/types/category";

const CATEGORIES_PATH = "/categories";
const SUBCATEGORIES_PATH = "/subcategories";

export const fetchCategoryTree = async (): Promise<ICategoryTree[]> => {
  const { data } = await apiClient.get<ICategoryTree[]>(`${CATEGORIES_PATH}/tree`);
  return data;
};

export const createCategory = async (
  payload: ICategoryPayload,
): Promise<ICategory> => {
  const { data } = await apiClient.post<ICategory>(CATEGORIES_PATH, payload);
  return data;
};

export const updateCategory = async (
  id: string,
  payload: ICategoryPayload,
): Promise<ICategory> => {
  const { data } = await apiClient.patch<ICategory>(
    `${CATEGORIES_PATH}/${id}`,
    payload,
  );
  return data;
};

export const createSubcategory = async (
  payload: ISubcategoryPayload,
): Promise<ISubcategory> => {
  const { data } = await apiClient.post<ISubcategory>(
    SUBCATEGORIES_PATH,
    payload,
  );
  return data;
};

export const updateSubcategory = async (
  id: string,
  payload: ISubcategoryPayload,
): Promise<ISubcategory> => {
  const { data } = await apiClient.patch<ISubcategory>(
    `${SUBCATEGORIES_PATH}/${id}`,
    payload,
  );
  return data;
};
