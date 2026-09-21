import { z } from "zod";

// Mirrors CreatePropertyDto — messages are message-catalogue keys, resolved at render
export const propertySchema = z.object({
  name: z.string().min(2, "nameLength").max(255, "nameLength"),
  addressLine1: z.string().min(1, "addressLine1Length").max(500, "addressLine1Length"),
  city: z.string().min(1, "cityLength").max(100, "cityLength"),
  status: z.boolean(),
});
