import type { IAssignedEntity } from "@/types/assigned-entity";

export interface ITenant {
  id: string;
  companyId: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

// Returned by the list endpoint only — the property/properties this tenant has an active lease on
export interface ITenantListItem extends ITenant {
  properties: IAssignedEntity[];
}

export interface ITenantFilters {
  search?: string;
  status?: boolean;
}

export interface ITenantQueryParams extends ITenantFilters {
  page: number;
  limit: number;
}

export interface ITenantPayload {
  name: string;
  email?: string;
  phone?: string;
  status?: boolean;
}

export interface ISaveTenantArgs {
  id?: string;
  payload: ITenantPayload;
}

export interface ITenantFormValues {
  name: string;
  email: string;
  phone: string;
  status: boolean;
}
