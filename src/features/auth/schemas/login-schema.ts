import { z } from "zod";

// Mirrors the backend LoginDto — messages are message-catalogue keys, resolved at render
export const loginSchema = z.object({
  email: z.string().trim().email("emailInvalid"),
  password: z.string().min(8, "passwordLength").max(128, "passwordLength"),
});
