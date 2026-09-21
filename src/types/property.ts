import type { IAssignedEntity } from "@/types/assigned-entity";

export interface IProperty {
  id: string;
  companyId: string;
  name: string;
  addressLine1: string;
  city: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

// Returned by the list endpoint only — the tenant(s) with an active lease on this property
export interface IPropertyListItem extends IProperty {
  tenants: IAssignedEntity[];
}

export interface IPropertyFilters {
  search?: string;
  city?: string;
  status?: boolean;
}

export interface IPropertyQueryParams extends IPropertyFilters {
  page: number;
  limit: number;
}

export interface IPropertyPayload {
  name: string;
  addressLine1: string;
  city: string;
  status?: boolean;
}

export interface ISavePropertyArgs {
  id?: string;
  payload: IPropertyPayload;
}

export interface IPropertyFormValues {
  name: string;
  addressLine1: string;
  city: string;
  status: boolean;
}
