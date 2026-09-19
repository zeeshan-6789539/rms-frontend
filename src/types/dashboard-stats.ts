import type { TLeaseStatus } from "@/types/lease";
import type { TPaymentMethod } from "@/types/payment";

export type TDashboardTrendRange = "6m" | "1y" | "all";

export interface IDashboardTotals {
  tenants: number;
  activeTenants: number;
  properties: number;
  activeLeases: number;
  assignedProperties: number;
  paymentsThisMonthCount: number;
  paymentsThisMonthTotal: string;
  paymentsLastMonthTotal: string;
}

export interface IDashboardTrendPoint {
  month: string;
  total: string;
}

export interface IDashboardPropertyStatusBreakdown {
  status: boolean;
  count: number;
}

export interface IDashboardRecentPayment {
  id: string;
  amountPaid: string;
  paymentDate: string;
  paymentMethod: TPaymentMethod;
  tenantName: string;
  propertyName: string;
}

export interface IDashboardOutstandingLease {
  id: string;
  propertyName: string;
  tenantName: string;
  status: TLeaseStatus;
  outstandingBalance: string;
}

export interface IDashboardStats {
  totals: IDashboardTotals;
  paymentsTrend: IDashboardTrendPoint[];
  propertyStatusBreakdown: IDashboardPropertyStatusBreakdown[];
  recentPayments: IDashboardRecentPayment[];
  outstandingLeases: IDashboardOutstandingLease[];
}
