export interface ICategory {
  id: string;
  name: string;
  companyId: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ISubcategory {
  id: string;
  name: string;
  categoryId: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ISubcategoryTree extends ISubcategory {
  productCount: number;
}

export interface ICategoryTree extends ICategory {
  productCount: number;
  subcategories: ISubcategoryTree[];
}

export interface ICategoryPayload {
  name: string;
}

export interface ISaveCategoryArgs {
  id?: string;
  payload: ICategoryPayload;
}

export interface ISubcategoryPayload {
  name: string;
  categoryId: string;
}

export interface ISaveSubcategoryArgs {
  id?: string;
  payload: ISubcategoryPayload;
}
