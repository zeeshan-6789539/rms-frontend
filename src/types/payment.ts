export type TPaymentMethod = "cash" | "bank_transfer" | "cheque" | "online";

export interface IPayment {
  id: string;
  companyId: string;
  propertyId: string;
  tenantId: string;
  leaseId: string;
  propertyName: string;
  tenantName: string;
  amountPaid: string;
  paymentDate: string;
  paymentMethod: TPaymentMethod;
  receiptNumber: string | null;
  referenceNumber: string | null;
  bankName: string | null;
  chequeClearanceDate: string | null;
  notes: string | null;
  createdAt: string;
  createdBy: string | null;
}

export interface IPaymentFilters {
  search?: string;
  leaseId?: string;
}

export interface IPaymentQueryParams extends IPaymentFilters {
  page: number;
  limit: number;
}

export interface ICreatePaymentPayload {
  leaseId: string;
  amountPaid: string;
  paymentDate: string;
  paymentMethod: TPaymentMethod;
  receiptNumber?: string;
  referenceNumber?: string;
  bankName?: string;
  chequeClearanceDate?: string;
  notes?: string;
}

export interface IPaymentFormValues {
  leaseId: string;
  amountPaid: string;
  paymentDate: string;
  paymentMethod: TPaymentMethod;
  receiptNumber: string;
  referenceNumber: string;
  bankName: string;
  chequeClearanceDate: string;
  notes: string;
}
