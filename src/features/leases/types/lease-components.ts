import type { ILease } from "@/types/lease";

export interface ILeasesTableProps {
  leases: readonly ILease[];
  onEdit: (lease: ILease) => void;
  onChangeStatus: (lease: ILease) => void;
  onChangeRent: (lease: ILease) => void;
}

export interface ILeaseFormDialogProps {
  isOpen: boolean;
  lease: ILease | null;
  onClose: () => void;
}

export interface ILeaseStatusDialogProps {
  isOpen: boolean;
  lease: ILease | null;
  onClose: () => void;
}

export interface IUpdateLeaseRentDialogProps {
  isOpen: boolean;
  lease: ILease | null;
  onClose: () => void;
}
