import { apiClient } from "@/lib/api-client";
import { buildQueryParams } from "@/utils/query-params";
import type { IPaginatedResult } from "@/types/api";
import type {
  ICreatePaymentPayload,
  IPayment,
  IPaymentQueryParams,
} from "@/types/payment";

const PAYMENTS_PATH = "/payments";

export const fetchPayments = async (
  params: IPaymentQueryParams,
): Promise<IPaginatedResult<IPayment>> => {
  const { data } = await apiClient.get<IPaginatedResult<IPayment>>(PAYMENTS_PATH, {
    params: buildQueryParams({ ...params }),
  });

  return data;
};

export const fetchPayment = async (id: string): Promise<IPayment> => {
  const { data } = await apiClient.get<IPayment>(`${PAYMENTS_PATH}/${id}`);
  return data;
};

export const createPayment = async (payload: ICreatePaymentPayload): Promise<IPayment> => {
  const { data } = await apiClient.post<IPayment>(PAYMENTS_PATH, payload);
  return data;
};
