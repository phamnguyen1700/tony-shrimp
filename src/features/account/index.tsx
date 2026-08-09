"use client";

import { useAppRuntime } from "@/providers/AppProviders";
import { useLogout, useRequestOtp, useVerifyOtp } from "@/hooks/auth";
import { useCurrentUser } from "@/hooks/user";
import { getApiErrorMessage } from "@/config/api";
import { useReducedMotion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getPostLoginRedirect } from "@/lib/authAccess";
import AccountScreen from "./components/AccountScreen";
import AccountLoginForm, { type LoginStep } from "./components/AccountLoginForm";

type AccountTab = "orders" | "profile" | "addresses";

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
  const [loginStep, setLoginStep] = useState<LoginStep>("email");
  const [loginEmail, setLoginEmail] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AccountTab>("orders");
  const [profileName, setProfileName] = useState("Alex Nguyen");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState("+61 400 000 000");
  const redirect = getSafeRedirect(searchParams.get("redirect"));

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
      setActiveTab("orders");
    }
  }

  if (!isHydrated && currentUserQuery.isLoading) {
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
    <AccountScreen
      t={t}
      reduced={reduced}
      activeTab={activeTab}
      profileName={profileName}
      profileEmail={profileEmail || user.email}
      profilePhone={profilePhone}
      onTabChange={setActiveTab}
      onProfileNameChange={setProfileName}
      onProfileEmailChange={setProfileEmail}
      onProfilePhoneChange={setProfilePhone}
      onSignOut={signOut}
    />
  );
}

function getSafeRedirect(value: string | null) {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}
