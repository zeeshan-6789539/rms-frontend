import type { TLeaseStatus } from "@/types/lease";
import type { TPaymentMethod } from "@/types/payment";

export interface IDashboardTotals {
  tenants: number;
  activeTenants: number;
  properties: number;
  activeLeases: number;
  paymentsThisMonthCount: number;
  paymentsThisMonthTotal: string;
  paymentsLastMonthTotal: string;
}

export interface IDashboardTrendPoint {
  month: string;
  total: string;
}

export interface IDashboardLeaseStatusBreakdown {
  status: TLeaseStatus;
  count: number;
}

export interface IDashboardPropertyStatusBreakdown {
  status: boolean;
  count: number;
}

export interface IDashboardPaymentMethodBreakdown {
  method: TPaymentMethod;
  count: number;
  total: string;
}

export interface IDashboardRecentPayment {
  id: string;
  amountPaid: string;
  paymentDate: string;
  paymentMethod: TPaymentMethod;
  tenantName: string;
  propertyName: string;
}

export interface IDashboardStats {
  totals: IDashboardTotals;
  paymentsTrend: IDashboardTrendPoint[];
  leaseStatusBreakdown: IDashboardLeaseStatusBreakdown[];
  propertyStatusBreakdown: IDashboardPropertyStatusBreakdown[];
  paymentMethodBreakdown: IDashboardPaymentMethodBreakdown[];
  recentPayments: IDashboardRecentPayment[];
}
