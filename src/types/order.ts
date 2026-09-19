import type { TOrderStatus } from "@/config/order-status";

export interface IOrderItem {
  id: string;
  productId: string;
  productName: string | null;
  quantity: number;
  price: number;
  createdAt: string;
}

export interface IOrder {
  id: string;
  companyId: string;
  userId: string;
  status: TOrderStatus;
  items: IOrderItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderFilters {
  status?: TOrderStatus;
  from?: string;
  to?: string;
  search?: string;
}

export interface IOrderQueryParams extends IOrderFilters {
  page: number;
  limit: number;
}

export interface ICheckoutItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface ICheckoutPayload {
  items: ICheckoutItem[];
}

export interface IUpdateOrderStatusPayload {
  status: TOrderStatus;
}

export interface IUpdateOrderStatusArgs {
  id: string;
  payload: IUpdateOrderStatusPayload;
}
