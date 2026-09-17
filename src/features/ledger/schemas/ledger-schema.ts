import { z } from "zod";

const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

const POSTABLE_CHARGE_TYPES = [
  "electricity_bill",
  "water_bill",
  "maintenance_charge",
  "other_charge",
  "advance_payment",
  "discount_adjustment",
  "advance_refund",
] as const;

// Mirrors CreateLedgerEntryDto — messages are message-catalogue keys, resolved at render
export const ledgerEntrySchema = z.object({
  leaseId: z.uuid("leaseRequired"),
  entryType: z.enum(POSTABLE_CHARGE_TYPES),
  amount: z.string().regex(MONEY_PATTERN, "amountInvalid"),
  dueDate: z.iso.date("dueDateInvalid").optional(),
  description: z.string().max(500, "descriptionLength").optional(),
});
