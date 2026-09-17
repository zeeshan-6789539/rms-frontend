"use client";

import { useEffect, useState } from "react";

export const useDebouncedValue = <TValue>(value: TValue, delay = 400): TValue => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
