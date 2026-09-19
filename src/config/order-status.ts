export const ORDER_STATUSES = [
  "pending",
  "processing",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
  "failed",
] as const;

export type TOrderStatus = (typeof ORDER_STATUSES)[number];

// Mirrors ORDER_STATUS_TRANSITIONS in the backend's orders.constants.ts
export const ORDER_STATUS_TRANSITIONS: Record<TOrderStatus, readonly TOrderStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["paid", "cancelled", "failed"],
  paid: ["shipped", "refunded"],
  shipped: ["delivered", "refunded"],
  delivered: ["refunded"],
  cancelled: [],
  refunded: [],
  failed: [],
};

export type TOrderStatusBadgeVariant = "success" | "danger" | "info" | "warning" | "muted";

export const ORDER_STATUS_BADGE_VARIANT: Record<TOrderStatus, TOrderStatusBadgeVariant> = {
  pending: "info",
  processing: "info",
  paid: "success",
  shipped: "success",
  delivered: "success",
  cancelled: "danger",
  refunded: "warning",
  failed: "danger",
};

// Roles allowed to move an order to its next status (mirrors the backend @Roles guard)
export const ORDER_STATUS_UPDATE_ROLES = ["client_admin", "manager"] as const;
