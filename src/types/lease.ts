export type TLeaseStatus = "active" | "terminated" | "expired";

export interface ILease {
  id: string;
  companyId: string;
  propertyId: string;
  tenantId: string;
  propertyName: string;
  tenantName: string;
  status: TLeaseStatus;
  startDate: string;
  endDate: string;
  advanceAmount: string;
  documentUrl: string | null;
  currentRent: string | null;
  outstandingBalance: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILeaseFilters {
  search?: string;
  propertyId?: string;
  tenantId?: string;
  status?: TLeaseStatus;
}

export interface ILeaseQueryParams extends ILeaseFilters {
  page: number;
  limit: number;
}

export interface ICreateLeasePayload {
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: string;
  advanceAmount?: string;
  documentUrl?: string;
}

export interface IUpdateLeasePayload {
  startDate?: string;
  endDate?: string;
  advanceAmount?: string;
  documentUrl?: string | null;
}

export interface ILeaseFormValues {
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: string;
  advanceAmount: string;
  documentUrl: string;
}

export interface IUpdateLeaseStatusPayload {
  status: TLeaseStatus;
}

export interface IUpdateLeaseRentPayload {
  rentAmount: string;
  effectiveFrom: string;
  notes?: string;
}

export interface IUpdateLeaseRentFormValues {
  rentAmount: string;
  effectiveFrom: string;
  notes: string;
}
