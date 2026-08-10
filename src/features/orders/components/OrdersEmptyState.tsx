import Link from "next/link";
import type { Translations } from "@/i18n";

interface OrdersEmptyStateProps {
  t: Translations;
  type: "signed-out" | "empty";
}

export default function OrdersEmptyState({ t, type }: OrdersEmptyStateProps) {
  const isSignedOut = type === "signed-out";

  return (
    <div className="py-16 text-center">
      <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
        {isSignedOut ? "Sign in to view your orders." : "No orders yet."}
      </p>
      <Link
        href={isSignedOut ? "/account?redirect=%2Forders" : "/shop"}
        className="mt-4 inline-block font-mono-label text-xs uppercase tracking-widest text-accent underline underline-offset-2"
      >
        {isSignedOut ? t.nav.account : "Browse the shop"} -&gt;
      </Link>
    </div>
  );
}
