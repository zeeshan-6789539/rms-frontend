import type { ITenant } from "@/types/tenant";

export interface ITenantsTableProps {
  tenants: readonly ITenant[];
  onEdit: (tenant: ITenant) => void;
  onToggleStatus: (tenant: ITenant) => void;
}

export interface ITenantFormDialogProps {
  isOpen: boolean;
  tenant: ITenant | null;
  onClose: () => void;
}
