import type { IPayment } from "@/types/payment";

export interface IPaymentsTableProps {
  payments: readonly IPayment[];
}

export interface IPaymentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
