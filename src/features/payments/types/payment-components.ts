import type { IPayment } from "@/types/payment";

export interface IPaymentsTableProps {
  payments: readonly IPayment[];
  onToggleStatus: (payment: IPayment) => void;
}

export interface IPaymentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLeaseId?: string;
  defaultLeaseLabel?: string;
}
