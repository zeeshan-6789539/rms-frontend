"use client";

import { useCallback, useState } from "react";
import type { TFormErrors } from "@/types/form";

export const useFormState = <TValues extends object>(initialValues: TValues) => {
  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<TFormErrors<TValues>>({});

  const setValue = useCallback(
    <TField extends keyof TValues>(field: TField, value: TValues[TField]) => {
      setValues((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    },
    [],
  );

  const reset = useCallback(
    (nextValues: TValues) => {
      setValues(nextValues);
      setErrors({});
    },
    [],
  );

  return { values, errors, setValue, setValues, setErrors, reset };
};
