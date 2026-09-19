import { apiClient } from "@/lib/api-client";
import { buildQueryParams } from "@/utils/query-params";
import type { IPaginatedResult } from "@/types/api";
import type {
  ICheckoutPayload,
  IOrder,
  IOrderQueryParams,
  IUpdateOrderStatusPayload,
} from "@/types/order";

const ORDERS_PATH = "/orders";

export const fetchOrders = async (
  params: IOrderQueryParams,
): Promise<IPaginatedResult<IOrder>> => {
  const { data } = await apiClient.get<IPaginatedResult<IOrder>>(ORDERS_PATH, {
    params: buildQueryParams({ ...params }),
  });

  return data;
};

export const fetchOrder = async (id: string): Promise<IOrder> => {
  const { data } = await apiClient.get<IOrder>(`${ORDERS_PATH}/${id}`);
  return data;
};

export const checkoutOrder = async (payload: ICheckoutPayload): Promise<IOrder> => {
  const { data } = await apiClient.post<IOrder>(`${ORDERS_PATH}/checkout`, payload);
  return data;
};

export const updateOrderStatus = async (
  id: string,
  payload: IUpdateOrderStatusPayload,
): Promise<IOrder> => {
  const { data } = await apiClient.patch<IOrder>(
    `${ORDERS_PATH}/${id}/status`,
    payload,
  );

  return data;
};
