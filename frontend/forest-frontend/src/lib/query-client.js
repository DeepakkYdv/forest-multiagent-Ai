import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => error.response?.status !== 401 && failureCount < 1,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
});
