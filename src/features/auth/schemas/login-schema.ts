import { z } from "zod";

// Mirrors the backend LoginDto — messages are message-catalogue keys, resolved at render
export const loginSchema = z.object({
  username: z.string().trim().min(3, "usernameLength").max(50, "usernameLength"),
  password: z.string().min(8, "passwordLength").max(128, "passwordLength"),
});
