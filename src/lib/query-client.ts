import { QueryClient, isServer } from "@tanstack/react-query";

const makeQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

let browserQueryClient: QueryClient | undefined;

// A fresh client per server request, a single shared client in the browser
export const getQueryClient = (): QueryClient => {
  if (isServer) return makeQueryClient();

  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
};
