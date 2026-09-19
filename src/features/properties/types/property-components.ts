import type { IProperty, IPropertyListItem } from "@/types/property";

export interface IPropertiesTableProps {
  properties: readonly IPropertyListItem[];
  onEdit: (property: IProperty) => void;
  onToggleStatus: (property: IProperty) => void;
}

export interface IPropertyFormDialogProps {
  isOpen: boolean;
  property: IProperty | null;
  onClose: () => void;
}
