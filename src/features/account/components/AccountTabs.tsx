import { motion } from "motion/react";
import type { Translations } from "@/i18n";
import type { AccountTab } from "./AccountScreen";

interface AccountTabsProps {
  t: Translations;
  activeTab: AccountTab;
  onTabChange: (tab: AccountTab) => void;
}

export default function AccountTabs({ t, activeTab, onTabChange }: AccountTabsProps) {
  const tabs: { key: AccountTab; label: string }[] = [
    { key: "orders", label: t.account.myOrders },
    { key: "profile", label: t.account.profile },
    { key: "addresses", label: t.account.addresses },
  ];

  return (
    <div className="mb-8 border-b border-border">
      <div className="flex gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`relative mr-8 px-0 pb-3 font-mono-label text-xs uppercase tracking-[0.16em] transition-colors ${
              activeTab === tab.key
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <motion.div
                className="absolute inset-x-0 bottom-0 h-[1.5px] bg-accent"
                layoutId="tab-indicator"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

