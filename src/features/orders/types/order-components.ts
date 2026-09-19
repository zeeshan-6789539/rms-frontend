import type { IOrder } from "@/types/order";

export interface IOrdersTableProps {
  orders: readonly IOrder[];
  onView: (order: IOrder) => void;
}

export interface IOrderDetailModalProps {
  order: IOrder | null;
  canUpdateStatus: boolean;
  onClose: () => void;
}
