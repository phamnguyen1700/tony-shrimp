import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section
      className="border border-border bg-card p-5"
      style={{ borderRadius: "var(--radius)" }}
    >
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-1 font-body text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}
