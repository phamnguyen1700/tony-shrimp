import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getLocalizedApiErrorMessage } from "@/lib/config/apiErrorMessages";
import { useAppRuntime } from "@/providers/AppProviders";
import { requestOtpSchema, verifyOtpSchema } from "@/schema/auth";
import { authService } from "@/services/auth";
import { authQueryKeys, userQueryKeys } from "@/hooks/user";
import { useAuthStore } from "@/store/authStore";
import type { RequestOtpPayload, VerifyOtpPayload } from "@/types/auth";

export function useRequestOtp() {
  const { t } = useAppRuntime();

  return useMutation({
    mutationFn: (payload: RequestOtpPayload) => {
      const validPayload = requestOtpSchema.parse(payload);
      return authService.requestOtp(validPayload);
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(getLocalizedApiErrorMessage(error, t, t.apiErrors.sendCodeFailed));
    },
  });
}

export function useVerifyOtp() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const { t } = useAppRuntime();

  return useMutation({
    mutationFn: async (payload: VerifyOtpPayload) => {
      const validPayload = verifyOtpSchema.parse(payload);
      const session = await authService.verifyOtp(validPayload);
      return session.user;
    },
    onSuccess: (user) => {
      queryClient.removeQueries({ queryKey: userQueryKeys.profile });
      queryClient.removeQueries({ queryKey: userQueryKeys.addresses });
      queryClient.setQueryData(authQueryKeys.me, user);
      setUser(user);
      toast.success("Signed in.");
    },
    onError: (error) => {
      toast.error(getLocalizedApiErrorMessage(error, t, t.apiErrors.verifyCodeFailed));
    },
  });
}

export function useRefreshToken() {
  const queryClient = useQueryClient();
  const { t } = useAppRuntime();

  return useMutation({
    mutationFn: () => authService.refresh(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authQueryKeys.me });
    },
    onError: (error) => {
      toast.error(getLocalizedApiErrorMessage(error, t, t.apiErrors.sessionRefreshFailed));
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((state) => state.clearUser);
  const { t } = useAppRuntime();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      toast("Signed out.");
    },
    onError: (error) => {
      toast.error(getLocalizedApiErrorMessage(error, t, t.apiErrors.logoutFailed));
    },
    onSettled: () => {
      clearUser();
      queryClient.removeQueries({ queryKey: authQueryKeys.me });
    },
  });
}
