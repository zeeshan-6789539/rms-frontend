export const USER_ROLES = [
  "super_admin",
  "client_admin",
  "manager",
  "staff",
  "customer",
] as const;

// Roles that may be assigned a company — super_admin is platform-level
export const COMPANY_ROLES = USER_ROLES.filter((role) => role !== "super_admin");
