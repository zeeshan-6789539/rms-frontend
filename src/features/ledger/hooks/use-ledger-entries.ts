"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ledgerKeys } from "@/features/ledger/api/ledger-keys";
import { fetchLedgerEntries } from "@/features/ledger/api/ledger.api";
import type { IApiError, IPaginatedResult } from "@/types/api";
import type { ILedgerEntry, ILedgerQueryParams } from "@/types/ledger";

export const useLedgerEntries = (params: ILedgerQueryParams, isEnabled = true) =>
  useQuery<IPaginatedResult<ILedgerEntry>, IApiError>({
    queryKey: ledgerKeys.list(params),
    queryFn: () => fetchLedgerEntries(params),
    enabled: isEnabled,
    // Keeps the current page on screen while the next one loads
    placeholderData: keepPreviousData,
  });
