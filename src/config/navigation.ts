import {
  BookText,
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  Users,
} from "lucide-react";
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
  {
    href: "/properties",
    labelKey: "properties",
    icon: Building2,
    roles: ["client_admin"],
  },
  {
    href: "/tenants",
    labelKey: "tenants",
    icon: Users,
    roles: ["client_admin"],
  },
  {
    href: "/leases",
    labelKey: "leases",
    icon: FileText,
    roles: ["client_admin"],
  },
  {
    href: "/payments",
    labelKey: "payments",
    icon: CreditCard,
    roles: ["client_admin"],
  },
  {
    href: "/ledger",
    labelKey: "ledger",
    icon: BookText,
    roles: ["client_admin"],
  },
];
