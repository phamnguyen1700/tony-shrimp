interface SettingsOptionButtonProps {
  icon: string;
  label: string;
  description?: string;
  isActive: boolean;
  onClick: () => void;
}

export default function SettingsOptionButton({
  icon,
  label,
  description,
  isActive,
  onClick,
}: SettingsOptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`flex flex-col items-start gap-2 border p-4 text-left transition-colors ${
        isActive ? "border-accent bg-accent/10" : "border-border bg-background hover:border-accent/40"
      }`}
      style={{ borderRadius: "var(--radius)" }}
    >
      <div className="flex w-full items-center justify-between">
        <span
          className={`flex h-8 w-8 items-center justify-center text-base ${
            isActive ? "text-accent" : "text-muted-foreground"
          }`}
        >
          {icon}
        </span>
        {isActive && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent">
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
              <path
                d="M1 3L3 5L7 1"
                stroke="var(--accent-foreground)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>
      <span
        className={`font-mono-label text-xs uppercase tracking-widest ${
          isActive ? "text-accent" : "text-foreground"
        }`}
      >
        {label}
      </span>
      {description && <span className="font-body text-xs text-muted-foreground">{description}</span>}
    </button>
  );
}
