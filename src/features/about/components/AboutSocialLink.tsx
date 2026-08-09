interface AboutSocialLinkProps {
  href: string;
}

export default function AboutSocialLink({ href }: AboutSocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-3 border border-border px-4 py-3 transition-colors hover:border-accent hover:text-accent"
      style={{ borderRadius: "var(--radius)" }}
    >
      <span
        className="flex h-7 w-7 items-center justify-center bg-foreground font-body text-sm font-semibold text-background"
        style={{ borderRadius: "999px" }}
        aria-hidden
      >
        f
      </span>
      <span className="font-mono-label text-xs uppercase tracking-[0.16em]">Facebook</span>
    </a>
  );
}
