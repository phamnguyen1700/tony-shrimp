import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { getLocalizedApiErrorMessage } from "@/lib/config/apiErrorMessages";
import { useAppRuntime } from "@/providers/AppProviders";
import { healthService } from "@/services/health";

export const healthQueryKeys = {
  check: ["health"] as const,
};

export function useHealthCheck() {
  const { t } = useAppRuntime();
  const query = useQuery({
    queryKey: healthQueryKeys.check,
    queryFn: healthService.check,
    retry: false,
  });

  useEffect(() => {
    if (!query.error) return;

    toast.error(getLocalizedApiErrorMessage(query.error, t, t.apiErrors.backendUnavailable));
  }, [query.error, t]);

  return query;
}
