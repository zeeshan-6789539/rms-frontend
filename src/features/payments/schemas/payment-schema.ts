import { z } from "zod";
import { getTodayIsoDate } from "@/utils/format";

const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

// Mirrors CreatePaymentDto — messages are message-catalogue keys, resolved at render
export const paymentSchema = z.object({
  leaseId: z.uuid("leaseRequired"),
  amountPaid: z.string().regex(MONEY_PATTERN, "amountInvalid"),
  paymentDate: z.iso
    .date("paymentDateRequired")
    .refine((value) => value <= getTodayIsoDate(), {
      message: "paymentDateFuture",
    }),
  paymentMethod: z.enum(["cash", "bank_transfer", "cheque", "online"]),
  receiptNumber: z.string().max(100, "receiptNumberLength").optional(),
  referenceNumber: z.string().max(100, "referenceNumberLength").optional(),
  bankName: z.string().max(100, "bankNameLength").optional(),
  chequeClearanceDate: z.iso.date("chequeClearanceDateInvalid").optional(),
  notes: z.string().max(500, "notesLength").optional(),
});
