import { apiClient } from "@/lib/api-client";
import { buildQueryParams } from "@/utils/query-params";
import type { IPaginatedResult } from "@/types/api";
import type {
  ICreateLedgerEntryPayload,
  IGenerateMonthlyRentResult,
  ILedgerEntry,
  ILedgerQueryParams,
} from "@/types/ledger";

const LEDGER_PATH = "/ledger";

export const fetchLedgerEntries = async (
  params: ILedgerQueryParams,
): Promise<IPaginatedResult<ILedgerEntry>> => {
  const { data } = await apiClient.get<IPaginatedResult<ILedgerEntry>>(LEDGER_PATH, {
    params: buildQueryParams({ ...params }),
  });

  return data;
};

export const fetchLedgerEntry = async (id: string): Promise<ILedgerEntry> => {
  const { data } = await apiClient.get<ILedgerEntry>(`${LEDGER_PATH}/${id}`);
  return data;
};

export const createLedgerEntry = async (
  payload: ICreateLedgerEntryPayload,
): Promise<ILedgerEntry> => {
  const { data } = await apiClient.post<ILedgerEntry>(LEDGER_PATH, payload);
  return data;
};

export const generateMonthlyRent = async (): Promise<IGenerateMonthlyRentResult> => {
  const { data } = await apiClient.post<IGenerateMonthlyRentResult>(
    `${LEDGER_PATH}/generate-monthly-rent`,
  );
  return data;
};

// DELETE deactivates — the row is kept and stays visible in the ledger, excluded from calculations
export const deactivateCharge = async (id: string): Promise<ILedgerEntry> => {
  const { data } = await apiClient.delete<ILedgerEntry>(`${LEDGER_PATH}/charges/${id}`);
  return data;
};

export const restoreCharge = async (id: string): Promise<ILedgerEntry> => {
  const { data } = await apiClient.patch<ILedgerEntry>(`${LEDGER_PATH}/charges/${id}/restore`);
  return data;
};
