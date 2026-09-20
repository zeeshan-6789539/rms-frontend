import type { ILedgerEntry } from "@/types/ledger";

export interface ILedgerTableProps {
  entries: readonly ILedgerEntry[];
  onToggleStatus: (entry: ILedgerEntry) => void;
}

export interface ILedgerEntryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLeaseId?: string;
  defaultLeaseLabel?: string;
}
