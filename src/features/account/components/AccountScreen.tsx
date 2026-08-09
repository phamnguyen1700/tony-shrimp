import { AnimatePresence, motion } from "motion/react";
import type { Translations } from "@/i18n";
import AccountAddressesPanel from "./AccountAddressesPanel";
import AccountHeader from "./AccountHeader";
import AccountOrdersPanel from "./AccountOrdersPanel";
import AccountProfilePanel from "./AccountProfilePanel";
import AccountTabs from "./AccountTabs";

export type AccountTab = "orders" | "profile" | "addresses";

interface AccountScreenProps {
  t: Translations;
  reduced: boolean | null;
  activeTab: AccountTab;
  profileName: string;
  profileEmail: string;
  profilePhone: string;
  onTabChange: (tab: AccountTab) => void;
  onProfileNameChange: (value: string) => void;
  onProfileEmailChange: (value: string) => void;
  onProfilePhoneChange: (value: string) => void;
  onSignOut: () => void;
}

export default function AccountScreen({
  t,
  reduced,
  activeTab,
  profileName,
  profileEmail,
  profilePhone,
  onTabChange,
  onProfileNameChange,
  onProfileEmailChange,
  onProfilePhoneChange,
  onSignOut,
}: AccountScreenProps) {
  return (
    <div className="app-page">
      <div className="mx-auto max-w-screen-lg px-4 py-8 md:px-8 md:py-12">
        <AccountHeader t={t} reduced={reduced} />
        <AccountTabs t={t} activeTab={activeTab} onTabChange={onTabChange} />

        <AnimatePresence mode="wait">
          {activeTab === "orders" && <AccountOrdersPanel key="orders" t={t} reduced={reduced} />}
          {activeTab === "profile" && (
            <AccountProfilePanel
              key="profile"
              reduced={reduced}
              profileName={profileName}
              profileEmail={profileEmail}
              profilePhone={profilePhone}
              onProfileNameChange={onProfileNameChange}
              onProfileEmailChange={onProfileEmailChange}
              onProfilePhoneChange={onProfilePhoneChange}
            />
          )}
          {activeTab === "addresses" && (
            <AccountAddressesPanel key="addresses" reduced={reduced} />
          )}
        </AnimatePresence>

        <div className="mt-16 border-t border-border pt-8">
          <button
            onClick={onSignOut}
            className="font-mono-label text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.account.signOut}
          </button>
        </div>
      </div>
    </div>
  );
}

