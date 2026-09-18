import type { TLedgerEntryType } from "@/types/ledger";
import type { TPaymentMethod } from "@/types/payment";
import type { TPeriodFilter } from "@/types/query-params";

// English-only labels for PDF output, kept separate from the UI's next-intl labels
export const ENTRY_TYPE_PDF_LABELS: Record<TLedgerEntryType, string> = {
  advance_payment: "Advance payment",
  monthly_rent: "Monthly rent",
  electricity_bill: "Electricity bill",
  water_bill: "Water bill",
  maintenance_charge: "Maintenance charge",
  payment_received: "Payment received",
  advance_refund: "Advance refund",
  discount_adjustment: "Discount adjustment",
  other_charge: "Other charge",
  rent_change: "Rent changed",
};

export const PAYMENT_METHOD_PDF_LABELS: Record<TPaymentMethod, string> = {
  cash: "Cash",
  bank_transfer: "Bank transfer",
  cheque: "Cheque",
  online: "Online",
};

export const PERIOD_PDF_LABELS: Record<TPeriodFilter, string> = {
  all: "All time",
  current_month: "Current month",
  last_month: "Last month",
  last_3_months: "Last 3 months",
  last_6_months: "Last 6 months",
};
