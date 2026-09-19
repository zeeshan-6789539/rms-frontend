import { z } from "zod";

// Mirrors CreateProductDto — messages are message-catalogue keys, resolved at render
export const productSchema = z.object({
  name: z.string().min(1, "required").max(255, "nameLength"),
  sellPrice: z.coerce.number("priceInvalid").min(0, "priceInvalid"),
  purchasePrice: z.coerce.number("priceInvalid").min(0, "priceInvalid"),
  quantity: z.coerce.number("quantityInvalid").int("quantityInvalid").min(0, "quantityInvalid"),
  subcategoryId: z.uuid("subcategoryInvalid"),
});
