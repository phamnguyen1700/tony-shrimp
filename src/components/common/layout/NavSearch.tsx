import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

interface NavSearchProps {
  isLanding: boolean;
}

export default function NavSearch({ isLanding }: NavSearchProps) {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState("");
  const open = expanded || value.trim().length > 0;
  const isShop = pathname === "/shop";

  useEffect(() => {
    if (!isShop) return;

    const params = new URLSearchParams(window.location.search);
    setValue(params.get("search") ?? "");
  }, [isShop]);

  useEffect(() => {
    if (!isShop) return;

    const timer = window.setTimeout(() => {
      applySearch(value, "replace");
    }, 350);

    return () => window.clearTimeout(timer);
  }, [isShop, value]);

  function focusInput() {
    setExpanded(true);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  function getShopHref(nextValue: string) {
    const params = new URLSearchParams(isShop ? window.location.search : "");
    const search = nextValue.trim();

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    const query = params.toString();
    return query ? `/shop?${query}` : "/shop";
  }

  function applySearch(nextValue: string, mode: "push" | "replace") {
    const href = getShopHref(nextValue);
    if (mode === "replace" && isShop) {
      router.replace(href, { scroll: false });
      return;
    }

    router.push(href);
  }

  return (
    <motion.form
      className={`relative hidden h-9 items-center overflow-hidden border md:flex ${
        isLanding
          ? "border-white/15 bg-black/10 text-white/70"
          : "border-transparent bg-transparent text-muted-foreground"
      }`}
      style={{ borderRadius: "999px" }}
      animate={{
        width: open ? 220 : 36,
        backgroundColor: open
          ? isLanding
            ? "rgba(8, 11, 8, 0.42)"
            : "var(--card)"
          : "rgba(0, 0, 0, 0)",
        borderColor: open
          ? isLanding
            ? "rgba(255, 255, 255, 0.22)"
            : "var(--border)"
          : "rgba(0, 0, 0, 0)",
      }}
      transition={
        reduced ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
      }
      onSubmit={(event) => {
        event.preventDefault();
        applySearch(value, "push");
      }}
    >
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onFocus={() => setExpanded(true)}
        onBlur={() => {
          if (!value.trim()) setExpanded(false);
        }}
        className={`h-full w-full bg-transparent pl-4 pr-10 font-body text-sm outline-none transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        } ${isLanding ? "placeholder:text-white/35" : "placeholder:text-muted-foreground/70"}`}
        placeholder="Search..."
        aria-label="Search"
      />
      <button
        type={open ? "submit" : "button"}
        onClick={() => {
          if (!open) focusInput();
        }}
        className={`absolute right-0 top-0 flex h-9 w-9 items-center justify-center transition-colors ${
          isLanding
            ? "text-white/60 hover:text-white"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Search"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" strokeWidth={1.5} />
          <path d="m21 21-4.35-4.35" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      </button>
    </motion.form>
  );
}
