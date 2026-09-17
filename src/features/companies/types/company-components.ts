import type { ICompany } from "@/types/company";

export interface ICompaniesTableProps {
  companies: readonly ICompany[];
  onEdit: (company: ICompany) => void;
  onToggleStatus: (company: ICompany) => void;
}

export interface ICompanyFormDialogProps {
  isOpen: boolean;
  company: ICompany | null;
  onClose: () => void;
}
