"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

// False during SSR and the first render, true once hydrated
export const useIsHydrated = (): boolean =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
