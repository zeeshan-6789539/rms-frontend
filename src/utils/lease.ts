import type { ILease } from "@/types/lease";

// One label format for a lease wherever it is picked or shown, e.g. "P-0007 Sunset Apartments – Ali Raza"
export const buildLeaseLabel = (
  lease: Pick<ILease, "propertyNumber" | "propertyName" | "tenantName">,
): string => `${lease.propertyNumber} ${lease.propertyName} – ${lease.tenantName}`;
