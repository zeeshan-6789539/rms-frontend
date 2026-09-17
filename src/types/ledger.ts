export type TChargeType =
  | "monthly_rent"
  | "electricity_bill"
  | "water_bill"
  | "maintenance_charge"
  | "other_charge"
  | "advance_payment"
  | "discount_adjustment"
  | "advance_refund"
  | "rent_change";

// Types a client is allowed to post manually — monthly_rent/rent_change are system-generated only
export type TPostableChargeType = Exclude<TChargeType, "monthly_rent" | "rent_change">;

export type TLedgerEntryType = TChargeType | "payment_received";

export type TTransactionType = "debit" | "credit";

export interface ILedgerEntry {
  id: string;
  companyId: string;
  propertyId: string;
  tenantId: string;
  leaseId: string;
  propertyName: string;
  tenantName: string;
  paymentId: string | null;
  entryType: TLedgerEntryType;
  transactionType: TTransactionType;
  amount: string;
  runningBalance: string | null;
  billingMonth: string | null;
  dueDate: string | null;
  description: string | null;
  createdAt: string;
  createdBy: string | null;
}

export interface ILedgerFilters {
  search?: string;
  leaseId?: string;
}

export interface ILedgerQueryParams extends ILedgerFilters {
  page: number;
  limit: number;
}

export interface ICreateLedgerEntryPayload {
  leaseId: string;
  entryType: TPostableChargeType;
  amount: string;
  dueDate?: string;
  description?: string;
}

export interface ILedgerFormValues {
  leaseId: string;
  entryType: TPostableChargeType;
  amount: string;
  dueDate: string;
  description: string;
}

export interface ISkippedLease {
  leaseId: string;
  propertyName: string;
  tenantName: string;
  reason: "no_rent_schedule" | "already_generated";
}

export interface IGenerateMonthlyRentResult {
  billingMonth: string;
  generated: ILedgerEntry[];
  skipped: ISkippedLease[];
}
