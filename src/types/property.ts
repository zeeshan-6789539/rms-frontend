import type { PROPERTY_TYPES } from "@/config/property";
import type { IAssignedEntity } from "@/types/assigned-entity";

export type TPropertyType = (typeof PROPERTY_TYPES)[number];

export interface IProperty {
  id: string;
  companyId: string;
  propertyNumber: string;
  name: string;
  addressLine1: string;
  city: string;
  propertyType: TPropertyType;
  rentDueDay: number;
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
  propertyType?: TPropertyType;
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
  propertyType: TPropertyType;
  rentDueDay: number;
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
  propertyType: TPropertyType;
  rentDueDay: number;
  status: boolean;
}
