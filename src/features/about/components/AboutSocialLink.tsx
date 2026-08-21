import type { ReactNode } from "react";

interface AboutSocialLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
}

export default function AboutSocialLink({
  href,
  icon,
  label,
}: AboutSocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex items-center gap-3 border border-border px-4 py-3 transition-colors hover:border-accent hover:text-accent"
      style={{ borderRadius: "var(--radius)" }}
    >
      <span className="flex h-7 w-7 items-center justify-center" aria-hidden>
        {icon}
      </span>

      <span className="font-mono-label text-xs uppercase tracking-[0.16em]">
        {label}
      </span>
    </a>
  );
}
