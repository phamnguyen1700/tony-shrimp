import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getLocalizedApiErrorMessage } from "@/lib/config/apiErrorMessages";
import { useAppRuntime } from "@/providers/AppProviders";
import { ownerUserListQuerySchema, updateOwnerUserRoleSchema } from "@/schema/customer";
import { customerService } from "@/services/customer";
import type { OwnerUserListQuery, UpdateOwnerUserRolePayload } from "@/types/customer";

export const customerQueryKeys = {
  ownerUsers: (params?: OwnerUserListQuery) => ["owner", "users", params ?? {}] as const,
  ownerUserDetail: (userId: string) => ["owner", "users", userId] as const,
};

function validateId(value: string) {
  if (!value) throw new Error("Missing user id.");
  return value;
}

export function useOwnerUsers(params?: OwnerUserListQuery, enabled = true) {
  const validParams = ownerUserListQuerySchema.parse(params ?? {});

  return useQuery({
    queryKey: customerQueryKeys.ownerUsers(validParams),
    queryFn: () => customerService.listOwnerUsers(validParams),
    enabled,
  });
}

export function useOwnerUserDetail(userId: string | null) {
  return useQuery({
    queryKey: customerQueryKeys.ownerUserDetail(userId ?? "idle"),
    queryFn: () => customerService.getOwnerUserDetail(validateId(userId ?? "")),
    enabled: Boolean(userId),
  });
}

export function useActivateOwnerUser() {
  const queryClient = useQueryClient();
  const { t } = useAppRuntime();

  return useMutation({
    mutationFn: (userId: string) => customerService.activateOwnerUser(validateId(userId)),
    onSuccess: (user) => {
      toast.success("User activated.");
      queryClient.setQueryData(customerQueryKeys.ownerUserDetail(user.id), user);
      void queryClient.invalidateQueries({ queryKey: ["owner", "users"] });
    },
    onError: (error) => toast.error(getLocalizedApiErrorMessage(error, t, t.apiErrors.activateUserFailed)),
  });
}

export function useDeactivateOwnerUser() {
  const queryClient = useQueryClient();
  const { t } = useAppRuntime();

  return useMutation({
    mutationFn: (userId: string) => customerService.deactivateOwnerUser(validateId(userId)),
    onSuccess: (user) => {
      toast.success("User deactivated.");
      queryClient.setQueryData(customerQueryKeys.ownerUserDetail(user.id), user);
      void queryClient.invalidateQueries({ queryKey: ["owner", "users"] });
    },
    onError: (error) => toast.error(getLocalizedApiErrorMessage(error, t, t.apiErrors.deactivateUserFailed)),
  });
}

export function useUpdateOwnerUserRole() {
  const queryClient = useQueryClient();
  const { t } = useAppRuntime();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpdateOwnerUserRolePayload }) =>
      customerService.updateOwnerUserRole(validateId(userId), updateOwnerUserRoleSchema.parse(payload)),
    onSuccess: (user) => {
      toast.success("User role updated.");
      queryClient.setQueryData(customerQueryKeys.ownerUserDetail(user.id), user);
      void queryClient.invalidateQueries({ queryKey: ["owner", "users"] });
    },
    onError: (error) => toast.error(getLocalizedApiErrorMessage(error, t, t.apiErrors.updateUserRoleFailed)),
  });
}

export function useHardDeleteOwnerUser() {
  const queryClient = useQueryClient();
  const { t } = useAppRuntime();

  return useMutation({
    mutationFn: (userId: string) => customerService.hardDeleteOwnerUser(validateId(userId)),
    onSuccess: (_data, userId) => {
      toast.success("User permanently deleted.");
      queryClient.removeQueries({ queryKey: customerQueryKeys.ownerUserDetail(userId) });
      void queryClient.invalidateQueries({ queryKey: ["owner", "users"] });
    },
    onError: (error) => toast.error(getLocalizedApiErrorMessage(error, t, t.apiErrors.deleteUserFailed)),
  });
}

