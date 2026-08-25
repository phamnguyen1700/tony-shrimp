import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { ApiError } from "@/config/api";
import { getLocalizedApiErrorMessage } from "@/lib/config/apiErrorMessages";
import { useAppRuntime } from "@/providers/AppProviders";
import {
  addressLocalityCheckQuerySchema,
  addressSuburbsQuerySchema,
  createUserAddressSchema,
  updateUserAddressSchema,
  updateUserProfileSchema,
} from "@/schema/user";
import { userService } from "@/services/user";
import { useAuthStore } from "@/store/authStore";
import type {
  AddressLocalityCheckQuery,
  AddressSuburbsQuery,
  CreateUserAddressPayload,
  UpdateUserAddressPayload,
  UpdateUserProfilePayload,
} from "@/types/user";

export const authQueryKeys = {
  me: ["auth", "me"] as const,
};

export const userQueryKeys = {
  profile: ["user", "profile"] as const,
  addressOptions: ["user", "address-options"] as const,
  addresses: ["user", "addresses"] as const,
  addressSuburbs: (query: AddressSuburbsQuery) =>
    ["user", "address-suburbs", query.search] as const,
  addressLocalityCheck: (query: AddressLocalityCheckQuery) =>
    ["user", "address-locality-check", query.suburb, query.postcode] as const,
};

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setHydrated = useAuthStore((state) => state.setHydrated);
  const query = useQuery({
    queryKey: authQueryKeys.me,
    queryFn: userService.getCurrentUser,
    retry: false,
  });

  useEffect(() => {
    if (query.data) setUser(query.data);
    if (query.error instanceof ApiError && query.error.status === 401) clearUser();
    if (!query.isLoading) setHydrated(true);
  }, [clearUser, query.data, query.error, query.isLoading, setHydrated, setUser]);

  return query;
}

export function useUserProfile() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: userQueryKeys.profile,
    queryFn: userService.getUserProfile,
    enabled: Boolean(user),
    retry: false,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  const { t } = useAppRuntime();

  return useMutation({
    mutationFn: (payload: UpdateUserProfilePayload) => {
      const validPayload = updateUserProfileSchema.parse(payload);
      return userService.updateUserProfile(validPayload);
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(userQueryKeys.profile, profile);
      toast.success("Profile updated.");
    },
    onError: (error) => {
      toast.error(getLocalizedApiErrorMessage(error, t, t.apiErrors.updateProfileFailed));
    },
  });
}

export function useAddressOptions() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: userQueryKeys.addressOptions,
    queryFn: userService.getAddressOptions,
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 60,
  });
}

export function useAddressSuburbSuggestions(query: AddressSuburbsQuery | null) {
  const user = useAuthStore((state) => state.user);
  const parsed = query ? addressSuburbsQuerySchema.safeParse(query) : null;
  const validQuery = parsed?.success ? parsed.data : null;

  return useQuery({
    queryKey: validQuery
      ? userQueryKeys.addressSuburbs(validQuery)
      : ["user", "address-suburbs", "idle"],
    queryFn: () => userService.suggestAddressSuburbs(validQuery as AddressSuburbsQuery),
    enabled: Boolean(user) && Boolean(validQuery),
    retry: false,
  });
}

export function useAddressLocalityCheck(query: AddressLocalityCheckQuery | null) {
  const user = useAuthStore((state) => state.user);
  const parsed = query ? addressLocalityCheckQuerySchema.safeParse(query) : null;
  const validQuery = parsed?.success ? parsed.data : null;

  return useQuery({
    queryKey: validQuery
      ? userQueryKeys.addressLocalityCheck(validQuery)
      : ["user", "address-locality-check", "idle"],
    queryFn: () => userService.checkAddressLocality(validQuery as AddressLocalityCheckQuery),
    enabled: Boolean(user) && Boolean(validQuery),
    retry: false,
  });
}

export function useUserAddresses() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: userQueryKeys.addresses,
    queryFn: userService.listAddresses,
    enabled: Boolean(user),
    retry: false,
  });
}

export function useCreateUserAddress() {
  const queryClient = useQueryClient();
  const { t } = useAppRuntime();

  return useMutation({
    mutationFn: (payload: CreateUserAddressPayload) => {
      const validPayload = createUserAddressSchema.parse(payload);
      return userService.createAddress(validPayload);
    },
    onSuccess: () => {
      toast.success("Address saved.");
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.addresses });
    },
    onError: (error) => {
      toast.error(getLocalizedApiErrorMessage(error, t, t.apiErrors.saveAddressFailed));
    },
  });
}

export function useUpdateUserAddress() {
  const queryClient = useQueryClient();
  const { t } = useAppRuntime();

  return useMutation({
    mutationFn: ({ addressId, payload }: { addressId: string; payload: UpdateUserAddressPayload }) => {
      const validPayload = updateUserAddressSchema.parse(payload);
      return userService.updateAddress(addressId, validPayload);
    },
    onSuccess: () => {
      toast.success("Address updated.");
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.addresses });
    },
    onError: (error) => {
      toast.error(getLocalizedApiErrorMessage(error, t, t.apiErrors.updateAddressFailed));
    },
  });
}

export function useDeleteUserAddress() {
  const queryClient = useQueryClient();
  const { t } = useAppRuntime();

  return useMutation({
    mutationFn: (addressId: string) => userService.deleteAddress(addressId),
    onSuccess: () => {
      toast.success("Address deleted.");
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.addresses });
    },
    onError: (error) => {
      toast.error(getLocalizedApiErrorMessage(error, t, t.apiErrors.deleteAddressFailed));
    },
  });
}

export function useSetDefaultUserAddress() {
  const queryClient = useQueryClient();
  const { t } = useAppRuntime();

  return useMutation({
    mutationFn: (addressId: string) => userService.setDefaultAddress(addressId),
    onSuccess: () => {
      toast.success("Default address updated.");
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.addresses });
    },
    onError: (error) => {
      toast.error(getLocalizedApiErrorMessage(error, t, t.apiErrors.updateDefaultAddressFailed));
    },
  });
}
