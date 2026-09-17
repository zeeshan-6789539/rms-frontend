import { Building2, LayoutDashboard, Users } from "lucide-react";
import type { INavItem } from "@/types/navigation";

export const navItems: readonly INavItem[] = [
  { href: "/", labelKey: "dashboard", icon: LayoutDashboard },
  {
    href: "/companies",
    labelKey: "companies",
    icon: Building2,
    roles: ["super_admin"],
  },
  { href: "/users", labelKey: "users", icon: Users, roles: ["super_admin"] },
];
