"use client";

import { useAppRuntime } from "@/providers/AppProviders";
import { useLogout, useRequestOtp, useVerifyOtp } from "@/hooks/auth";
import {
  useAddressOptions,
  useAddressLocalityCheck,
  useAddressSuburbSuggestions,
  useCreateUserAddress,
  useCurrentUser,
  useDeleteUserAddress,
  useSetDefaultUserAddress,
  useUpdateUserAddress,
  useUpdateUserProfile,
  useUserAddresses,
  useUserProfile,
} from "@/hooks/user";
import { getApiErrorMessage } from "@/config/api";
import { createUserAddressSchema } from "@/schema/user";
import { normalizeAustralianPhone } from "@/lib/australianPhone";
import { motion, useReducedMotion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ZodError } from "zod";
import { useAuthStore } from "@/store/authStore";
import { getPostLoginRedirect } from "@/lib/authAccess";
import AccountAddressesPanel from "./components/AccountAddressesPanel";
import AccountHeader from "./components/AccountHeader";
import AccountLoginForm, { type LoginStep } from "./components/AccountLoginForm";
import AccountProfilePanel from "./components/AccountProfilePanel";
import type { AccountAddressDraft } from "./components/AccountAddressForm";
import type { UserAddress } from "@/types/user";

type AddressFieldErrors = Partial<Record<keyof AccountAddressDraft, string>>;

const emptyAddressDraft: AccountAddressDraft = {
  recipient_name: "",
  recipient_phone: "",
  address_line1: "",
  address_line2: "",
  suburb: "",
  state: "",
  postcode: "",
  is_default: false,
};

export default function AccountFeature() {
  const { t } = useAppRuntime();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduced = useReducedMotion();
  const requestOtpMutation = useRequestOtp();
  const verifyOtpMutation = useVerifyOtp();
  const logoutMutation = useLogout();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const currentUserQuery = useCurrentUser();
  const profileQuery = useUserProfile();
  const addressOptionsQuery = useAddressOptions();
  const addressesQuery = useUserAddresses();
  const updateProfileMutation = useUpdateUserProfile();
  const createAddressMutation = useCreateUserAddress();
  const updateAddressMutation = useUpdateUserAddress();
  const deleteAddressMutation = useDeleteUserAddress();
  const setDefaultAddressMutation = useSetDefaultUserAddress();
  const [loginStep, setLoginStep] = useState<LoginStep>("email");
  const [loginEmail, setLoginEmail] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressDraft, setAddressDraft] = useState<AccountAddressDraft>(emptyAddressDraft);
  const [addressTouched, setAddressTouched] = useState(false);
  const [debouncedAddressDraft, setDebouncedAddressDraft] =
    useState<AccountAddressDraft>(emptyAddressDraft);
  const [mounted, setMounted] = useState(false);
  const redirect = getSafeRedirect(searchParams.get("redirect"));

  const addressSuggestionQuery = useMemo(() => {
    const suburb = debouncedAddressDraft.suburb.trim();
    const postcode = debouncedAddressDraft.postcode.trim();
    const search = suburb || postcode;

    if (search.length < 2) return null;
    return { search };
  }, [debouncedAddressDraft]);

  const addressLocalityQuery = useMemo(() => {
    const suburb = debouncedAddressDraft.suburb.trim();
    const postcode = debouncedAddressDraft.postcode.trim();

    if (!suburb || !/^\d{4}$/.test(postcode)) return null;
    return { suburb, postcode };
  }, [debouncedAddressDraft]);
  const addressSuggestionQueryResult = useAddressSuburbSuggestions(addressSuggestionQuery);
  const addressLocalityQueryResult = useAddressLocalityCheck(addressLocalityQuery);
  const savedProfileName = profileQuery.data?.full_name ?? "";
  const savedProfilePhone = profileQuery.data?.phone ? normalizeAustralianPhone(profileQuery.data.phone) : "";
  const isProfileDirty =
    profileName.trim() !== savedProfileName.trim() ||
    normalizeAustralianPhone(profilePhone) !== savedProfilePhone;
  const parsedAddressDraft = createUserAddressSchema.safeParse(addressDraft);
  const addressFieldErrors = addressTouched && !parsedAddressDraft.success
    ? zodErrorsToAddressFieldErrors(parsedAddressDraft.error)
    : {};

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!profileQuery.data) return;
    setProfileName(profileQuery.data.full_name ?? "");
    setProfilePhone(profileQuery.data.phone ? normalizeAustralianPhone(profileQuery.data.phone) : "");
  }, [profileQuery.data]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedAddressDraft(addressDraft);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [addressDraft]);

  async function requestOtp(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    setAuthError(null);

    try {
      await requestOtpMutation.mutateAsync({ email: normalizedEmail });
      setLoginEmail(normalizedEmail);
      setLoginStep("code");
    } catch (error) {
      setAuthError(getApiErrorMessage(error, "Could not send login code."));
    }
  }

  async function verifyOtp(code: string) {
    setAuthError(null);

    try {
      const signedInUser = await verifyOtpMutation.mutateAsync({ email: loginEmail, code });
      router.replace(redirect ?? getPostLoginRedirect(signedInUser));
    } catch (error) {
      setAuthError(getApiErrorMessage(error, "Could not verify login code."));
    }
  }

  async function signOut() {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      setLoginStep("email");
      setLoginEmail("");
      setAuthError(null);
    }
  }

  async function saveProfile() {
    await updateProfileMutation.mutateAsync({
      full_name: profileName,
      phone: profilePhone,
    });
  }

  function openAddAddressForm() {
    setEditingAddressId(null);
    setAddressTouched(false);
    setAddressDraft({
      ...emptyAddressDraft,
      recipient_name: profileName,
      recipient_phone: normalizeAustralianPhone(profilePhone),
      is_default: (addressesQuery.data ?? []).length === 0,
    });
    setAddressFormOpen(true);
  }

  function openEditAddressForm(address: UserAddress) {
    setEditingAddressId(address.id);
    setAddressTouched(false);
    setAddressDraft(addressDraftFromAddress(address));
    setAddressFormOpen(true);
  }

  async function saveAddress() {
    setAddressTouched(true);
    const parsedPayload = createUserAddressSchema.safeParse(addressDraft);
    if (!parsedPayload.success) return;

    if (editingAddressId) {
      await updateAddressMutation.mutateAsync({ addressId: editingAddressId, payload: parsedPayload.data });
    } else {
      await createAddressMutation.mutateAsync(parsedPayload.data);
    }

    setAddressFormOpen(false);
    setEditingAddressId(null);
    setAddressTouched(false);
  }

  async function deleteAddress(addressId: string) {
    await deleteAddressMutation.mutateAsync(addressId);

    if (editingAddressId === addressId) {
      setAddressFormOpen(false);
      setEditingAddressId(null);
    }
  }

  if (!mounted || (!isHydrated && currentUserQuery.isLoading)) {
    return (
      <div className="app-page">
        <div className="mx-auto max-w-screen-lg px-4 py-8 md:px-8 md:py-12">
          <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
            Loading account...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AccountLoginForm
        t={t}
        reduced={reduced}
        step={loginStep}
        email={loginEmail}
        error={authError}
        isSubmitting={requestOtpMutation.isPending || verifyOtpMutation.isPending}
        onRequestOtp={requestOtp}
        onVerifyOtp={verifyOtp}
        onChangeEmail={() => {
          setAuthError(null);
          setLoginStep("email");
        }}
      />
    );
  }

  return (
    <div className="app-page">
      <div className="mx-auto max-w-screen-lg px-4 py-8 md:px-8 md:py-12">
        <AccountHeader t={t} reduced={reduced} />

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10"
        >
          <AccountProfilePanel
            t={t}
            profileName={profileName}
            profileEmail={profileQuery.data?.email ?? user.email}
            profilePhone={profilePhone}
            onProfileNameChange={setProfileName}
            onProfilePhoneChange={setProfilePhone}
            onSaveProfile={saveProfile}
            isSaving={updateProfileMutation.isPending}
            isDirty={isProfileDirty}
          />

          <div className="border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <AccountAddressesPanel
              t={t}
              reduced={reduced}
              addresses={addressesQuery.data ?? []}
              formDraft={addressDraft}
              formOpen={addressFormOpen}
              editingAddressId={editingAddressId}
              states={addressOptionsQuery.data?.states ?? ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"]}
              suburbSuggestions={addressSuggestionQueryResult.data?.items ?? []}
              localityCheck={addressLocalityQueryResult.data}
              errors={addressFieldErrors}
              canSave={parsedAddressDraft.success}
              isLoading={addressesQuery.isLoading}
              isValidating={addressSuggestionQueryResult.isFetching || addressLocalityQueryResult.isFetching}
              isMutating={
                createAddressMutation.isPending ||
                updateAddressMutation.isPending ||
                deleteAddressMutation.isPending ||
                setDefaultAddressMutation.isPending
              }
              onAddAddress={openAddAddressForm}
              onEditAddress={openEditAddressForm}
              onDeleteAddress={deleteAddress}
              onSetDefaultAddress={(addressId) => setDefaultAddressMutation.mutate(addressId)}
              onDraftChange={(draft) => {
                setAddressTouched(true);
                setAddressDraft(draft);
              }}
              onSaveAddress={saveAddress}
              onCancelForm={() => {
                setAddressFormOpen(false);
                setEditingAddressId(null);
                setAddressTouched(false);
              }}
            />
          </div>
        </motion.div>

        <div className="mt-16 border-t border-border pt-8">
          <button
            onClick={signOut}
            className="font-mono-label text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.account.signOut}
          </button>
        </div>
      </div>
    </div>
  );
}

function addressDraftFromAddress(address: UserAddress): AccountAddressDraft {
  return {
    recipient_name: address.recipient_name,
    recipient_phone: normalizeAustralianPhone(address.recipient_phone),
    address_line1: address.address_line1,
    address_line2: address.address_line2 ?? "",
    suburb: address.suburb,
    state: address.state,
    postcode: address.postcode,
    is_default: address.is_default,
  };
}

function getSafeRedirect(value: string | null) {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

function zodErrorsToAddressFieldErrors(error: ZodError): AddressFieldErrors {
  return error.issues.reduce<AddressFieldErrors>((errors, issue) => {
    const field = issue.path[0] as keyof AccountAddressDraft | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
    return errors;
  }, {});
}
