import { z } from "zod";

const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

// http(s) only, so a stored link can never become a javascript: href
const documentUrlSchema = z
  .url({ protocol: /^https?$/, error: "documentUrlInvalid" })
  .max(2048, "documentUrlLength");

// Mirrors CreateLeaseDto — messages are message-catalogue keys, resolved at render
export const createLeaseSchema = z
  .object({
    propertyId: z.uuid("propertyRequired"),
    tenantId: z.uuid("tenantRequired"),
    startDate: z.iso.date("startDateRequired"),
    endDate: z.iso.date("endDateRequired"),
    monthlyRent: z.string().regex(MONEY_PATTERN, "monthlyRentInvalid"),
    advanceAmount: z.string().regex(MONEY_PATTERN, "advanceAmountInvalid").optional(),
    documentUrl: documentUrlSchema.optional(),
  })
  .refine((values) => values.endDate > values.startDate, {
    message: "endDateBeforeStart",
    path: ["endDate"],
  });

// Mirrors UpdateLeaseDto — propertyId/tenantId/monthlyRent can't change after creation
export const updateLeaseSchema = z
  .object({
    startDate: z.iso.date("startDateRequired"),
    endDate: z.iso.date("endDateRequired"),
    advanceAmount: z.string().regex(MONEY_PATTERN, "advanceAmountInvalid").optional(),
    documentUrl: documentUrlSchema.nullable(),
  })
  .refine((values) => values.endDate > values.startDate, {
    message: "endDateBeforeStart",
    path: ["endDate"],
  });

// Mirrors UpdateLeaseRentDto
export const updateLeaseRentSchema = z.object({
  rentAmount: z.string().regex(MONEY_PATTERN, "rentAmountInvalid"),
  effectiveFrom: z.iso.date("effectiveFromRequired"),
  notes: z.string().max(500, "notesLength").optional(),
});
