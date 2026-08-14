export type CustomerTab = "active" | "inactive" | "admin";

interface CustomerTabsProps {
  activeTab: CustomerTab;
  counts: Record<CustomerTab, number>;
  onTabChange: (tab: CustomerTab) => void;
}

const tabs: Array<{ value: CustomerTab; label: string }> = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "admin", label: "Owner / Admin" },
];

export default function CustomerTabs({ activeTab, counts, onTabChange }: CustomerTabsProps) {
  return (
    <div className="flex flex-wrap gap-6 border-b border-border">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={`relative pb-3 font-mono-label text-xs uppercase tracking-[0.18em] transition-colors ${
              isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{tab.label}</span>
            <span className="ml-2 text-[10px] text-muted-foreground">{counts[tab.value]}</span>
            {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
          </button>
        );
      })}
    </div>
  );
}
