import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ApiError } from "@/config/api";
import { getAuthTokens } from "@/services/auth";
import { userService } from "@/services/user";
import { useAuthStore } from "@/store/authStore";

export const authQueryKeys = {
  me: ["auth", "me"] as const,
};

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setHydrated = useAuthStore((state) => state.setHydrated);
  const hasTokens = Boolean(getAuthTokens());
  const query = useQuery({
    queryKey: authQueryKeys.me,
    queryFn: userService.getCurrentUser,
    enabled: hasTokens,
    retry: false,
  });

  useEffect(() => {
    if (!hasTokens) {
      clearUser();
      return;
    }

    if (query.data) setUser(query.data);
    if (query.error instanceof ApiError && query.error.status === 401) clearUser();
    if (!query.isLoading) setHydrated(true);
  }, [clearUser, hasTokens, query.data, query.error, query.isLoading, setHydrated, setUser]);

  return query;
}
