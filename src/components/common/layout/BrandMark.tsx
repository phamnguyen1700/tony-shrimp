import Image from "next/image";

interface BrandMarkProps {
  tagline: string;
  isAdmin?: boolean;
  tone?: "light" | "dark";
  size?: "nav" | "footer";
}

export default function BrandMark({
  tagline,
  isAdmin = false,
  tone = "dark",
  size = "nav",
}: BrandMarkProps) {
  const isFooter = size === "footer";
  const textColor = tone === "light" ? "#f7f3ea" : "var(--foreground)";
  const mutedColor =
    tone === "light" ? "rgba(247,243,234,0.58)" : "var(--muted-foreground)";

  return (
    <span
      className={`flex items-center leading-none ${isFooter ? "gap-3" : "gap-2"}`}
    >
      <span
        className={`relative shrink-0 overflow-hidden ${isFooter ? "h-36 w-36" : "h-14 w-14"}`}
      >
        <Image
          src="/logo/tony-shrimp-logo.png"
          alt=""
          fill
          sizes={isFooter ? "72px" : "40px"}
          className="object-contain"
          aria-hidden="true"
        />
      </span>
      <span className="flex flex-col">
        <span
          className={`font-display font-semibold uppercase ${
            isFooter
              ? "text-2xl tracking-[0.2em]"
              : "text-[15px] tracking-[0.18em]"
          }`}
          style={{ color: textColor }}
        >
          TONY SHRIMP
        </span>
        <span
          className={`font-mono-label uppercase ${
            isFooter ? "text-xs tracking-[0.28em]" : "text-xs tracking-[0.24em]"
          }`}
          style={{ color: mutedColor }}
        >
          {tagline}
          {isAdmin ? " - ADMIN" : ""}
        </span>
      </span>
    </span>
  );
}
