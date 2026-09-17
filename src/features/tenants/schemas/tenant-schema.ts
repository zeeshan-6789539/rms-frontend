import { z } from "zod";

const PHONE_PATTERN = /^(?:\+92|0)3\d{9}$/;

// Mirrors CreateTenantDto — messages are message-catalogue keys, resolved at render
export const tenantSchema = z.object({
  name: z.string().min(2, "nameLength").max(255, "nameLength"),
  email: z.email("emailInvalid").max(255, "emailLength").optional(),
  phone: z.string().regex(PHONE_PATTERN, "phoneInvalid").optional(),
  status: z.boolean(),
});
