import type { ZodError } from "zod";
import type { TFormErrors } from "@/types/form";

// Schemas carry message-catalogue keys, so each issue is translated on the way out
export const toTranslatedFieldErrors = <TValues>(
  error: ZodError,
  translate: (key: string) => string,
): TFormErrors<TValues> => {
  const fieldErrors: TFormErrors<TValues> = {};

  error.issues.forEach((issue) => {
    const [field] = issue.path;

    if (typeof field !== "string") return;

    const key = field as keyof TValues;

    if (fieldErrors[key] !== undefined) return;

    fieldErrors[key] = translate(issue.message);
  });

  return fieldErrors;
};
