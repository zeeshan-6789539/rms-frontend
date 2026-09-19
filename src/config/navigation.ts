import {
  Building2,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Users,
  ClipboardList,
} from "lucide-react";
import type { INavItem } from "@/types/navigation";

const SHOP_ROLES = ["client_admin", "manager", "staff"] as const;

export const navItems: readonly INavItem[] = [
  { href: "/", labelKey: "dashboard", icon: LayoutDashboard },
  {
    href: "/companies",
    labelKey: "companies",
    icon: Building2,
    roles: ["super_admin"],
  },
  { href: "/users", labelKey: "users", icon: Users, roles: ["super_admin"] },
  { href: "/categories", labelKey: "categories", icon: Tags, roles: [...SHOP_ROLES] },
  { href: "/products", labelKey: "products", icon: Package, roles: [...SHOP_ROLES] },
  { href: "/orders", labelKey: "orders", icon: ClipboardList, roles: [...SHOP_ROLES] },
  { href: "/cart", labelKey: "cart", icon: ShoppingCart, roles: [...SHOP_ROLES] },
];
