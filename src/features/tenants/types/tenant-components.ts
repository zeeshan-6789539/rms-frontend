import type { ITenant, ITenantListItem } from "@/types/tenant";

export interface ITenantsTableProps {
  tenants: readonly ITenantListItem[];
  onEdit: (tenant: ITenant) => void;
  onToggleStatus: (tenant: ITenant) => void;
}

export interface ITenantFormDialogProps {
  isOpen: boolean;
  tenant: ITenant | null;
  onClose: () => void;
}
