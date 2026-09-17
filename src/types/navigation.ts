import type { LucideIcon } from "lucide-react";
import type { TUserRole } from "@/types/user";

export interface INavItem {
  href: string;
  labelKey: string;
  icon: LucideIcon;
  roles?: readonly TUserRole[];
}
