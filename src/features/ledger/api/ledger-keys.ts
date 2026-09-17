import type { ILedgerQueryParams } from "@/types/ledger";

export const ledgerKeys = {
  all: ["ledger"] as const,
  lists: () => [...ledgerKeys.all, "list"] as const,
  list: (params: ILedgerQueryParams) => [...ledgerKeys.lists(), params] as const,
  details: () => [...ledgerKeys.all, "detail"] as const,
  detail: (id: string) => [...ledgerKeys.details(), id] as const,
};
