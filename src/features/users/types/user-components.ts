import type { IUser } from "@/types/user";

export interface IUsersTableProps {
  users: readonly IUser[];
  companyNameById: Map<string, string>;
  currentUserId?: string;
  onEdit: (user: IUser) => void;
  onToggleStatus: (user: IUser) => void;
}

export interface IUserFormDialogProps {
  isOpen: boolean;
  user: IUser | null;
  onClose: () => void;
}
