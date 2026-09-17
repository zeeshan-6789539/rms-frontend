import type { ILedgerEntry } from "@/types/ledger";

export interface ILedgerTableProps {
  entries: readonly ILedgerEntry[];
}

export interface ILedgerEntryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
