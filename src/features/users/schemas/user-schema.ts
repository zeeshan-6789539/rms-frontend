import { z } from "zod";
import { USER_ROLES } from "@/config/roles";

const PHONE_PATTERN = /^(?:\+92|0)3\d{9}$/;

// Mirrors CreateUserDto — messages are message-catalogue keys, resolved at render
const baseUserSchema = z.object({
  email: z.email("emailInvalid").max(255, "emailLength"),
  password: z.string().min(8, "passwordLength").max(128, "passwordLength"),
  name: z.string().min(1, "required").max(150, "nameLength"),
  phone: z.string().regex(PHONE_PATTERN, "phoneInvalid").optional(),
  companyId: z.uuid("companyInvalid").optional(),
  role: z.enum(USER_ROLES),
  status: z.boolean(),
});

// Mirrors the users_super_admin_has_no_company check constraint
const hasValidCompanyForRole = (values: {
  role: (typeof USER_ROLES)[number];
  companyId?: string;
}): boolean => !(values.role === "super_admin" && Boolean(values.companyId));

const COMPANY_REFINEMENT = {
  message: "superAdminNoCompany",
  path: ["companyId"],
};

export const createUserSchema = baseUserSchema.refine(
  hasValidCompanyForRole,
  COMPANY_REFINEMENT,
);

// Omitted password means "keep the current one" — only validated when provided
export const updateUserSchema = baseUserSchema
  .omit({ password: true })
  .extend({
    password: z
      .string()
      .min(8, "passwordLength")
      .max(128, "passwordLength")
      .optional(),
  })
  .refine(hasValidCompanyForRole, COMPANY_REFINEMENT);
