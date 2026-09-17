import type { IProperty } from "@/types/property";

export interface IPropertiesTableProps {
  properties: readonly IProperty[];
  onEdit: (property: IProperty) => void;
  onToggleStatus: (property: IProperty) => void;
}

export interface IPropertyFormDialogProps {
  isOpen: boolean;
  property: IProperty | null;
  onClose: () => void;
}
