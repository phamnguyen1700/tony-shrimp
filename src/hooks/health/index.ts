import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/config/api";
import { healthService } from "@/services/health";

export const healthQueryKeys = {
  check: ["health"] as const,
};

export function useHealthCheck() {
  const query = useQuery({
    queryKey: healthQueryKeys.check,
    queryFn: healthService.check,
    retry: false,
  });

  useEffect(() => {
    if (!query.error) return;

    toast.error(getApiErrorMessage(query.error, "Backend unavailable."));
  }, [query.error]);

  return query;
}
